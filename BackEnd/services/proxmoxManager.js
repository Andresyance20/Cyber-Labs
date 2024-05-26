const axios = require('axios'); // Import axios
const https = require('https'); // Import HTTPS module for setting up custom agent
const WebSocket = require('ws');


// Hardcoded Proxmox credentials i dont know if eventually each user should habe his own proxmox credentials
const PROXMOX_USERNAME = 'API@pve'; 
const PROXMOX_PASSWORD = 'password'; 

const ProxmoxService = {
  // Function to get Proxmox authentication ticket and CSRF token
  getProxmoxTicket: async (host) => {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false, // Bypass SSL verification
    });

    try {
      const response = await axios.post(
        `${host}/api2/json/access/ticket`,
        new URLSearchParams({
          username: PROXMOX_USERNAME,
          password: PROXMOX_PASSWORD,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          httpsAgent,
        }
      );

      const data = response.data.data;
      return {
        ticket: data.ticket,
        csrfToken: data.CSRFPreventionToken,
      };
    } catch (error) {
      console.error('Error getting Proxmox ticket:', error);
      throw error; // Rethrow the error to handle it in the caller function
    }
  },

  // Function to start a VM on Proxmox
  startProxmoxVM: async (host, nodeId, vmId) => {
    const { ticket, csrfToken } = await ProxmoxService.getProxmoxTicket(host);

    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    const cookie = `PVEAuthCookie=${encodeURIComponent(ticket)}`;

    try {
      const response = await axios.post(
        `${host}/api2/json/nodes/${nodeId}/qemu/${vmId}/status/start`,
        {},
        {
          headers: {
            'Cookie': cookie,
            'CSRFPreventionToken': csrfToken,
          },
          httpsAgent,
        }
      );

      console.log('VM started successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error starting VM:', error);
      throw error; // Rethrow to handle in the caller function
    }
  },

  // Function to shut down a VM on Proxmox
  shutdownProxmoxVM: async (host, nodeId, vmId) => {
    const { ticket, csrfToken } = await ProxmoxService.getProxmoxTicket(host);

    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    const cookie = `PVEAuthCookie=${encodeURIComponent(ticket)}`;

    try {
      const response = await axios.post(
        `${host}/api2/json/nodes/${nodeId}/qemu/${vmId}/status/shutdown`,
        {},
        {
          headers: {
            'Cookie': cookie,
            'CSRFPreventionToken': csrfToken,
          },
          httpsAgent,
        }
      );

      console.log('VM shut down successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error shutting down VM:', error);
      throw error; // Rethrow to handle in the caller function
    }
  },

  // Function to get the current status of a VM on Proxmox
  getProxmoxVMStatus: async (host, nodeId, vmId) => {
    const { ticket, csrfToken } = await ProxmoxService.getProxmoxTicket(host);

    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    const cookie = `PVEAuthCookie=${encodeURIComponent(ticket)}`;

    try {
      const response = await axios.get(
        `${host}/api2/json/nodes/${nodeId}/qemu/${vmId}/status/current`,
        {
          headers: {
            'Cookie': cookie,
            'CSRFPreventionToken': csrfToken,
          },
          httpsAgent,
        }
      );

      console.log('VM current status:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting VM status:', error.data);
      throw error; // Rethrow to handle in the caller function
    }
  },


  // Function to get all VMs on a node
  listProxmoxVMs: async (host, node) => {
    const { ticket, csrfToken } = await ProxmoxService.getProxmoxTicket(host);

    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    const cookie = `PVEAuthCookie=${encodeURIComponent(ticket)}`;

    const response = await axios.get(
      `${host}/api2/json/nodes/${node}/qemu`,
      {
        headers: {
          'Cookie': cookie,
          'CSRFPreventionToken': csrfToken,
        },
        httpsAgent,
      }
    );

  return response.data;
 },

 createVNCProxy: async (host, node, vmId) => {
  const { ticket, csrfToken } = await ProxmoxService.getProxmoxTicket(host);

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  const cookie = `PVEAuthCookie=${encodeURIComponent(ticket)}`;

  try {
    const response = await axios.post(
      `${host}/api2/json/nodes/${node}/qemu/${vmId}/vncproxy`,
      {},
      {
        headers: {
          'Cookie': cookie,
          'CSRFPreventionToken': csrfToken,
        },
        httpsAgent,
      }
    );

    const vncData = response.data.data;
    console.log('VNC proxy created:', vncData.port);
    console.log(vncData.ticket)
    console.log('Connecting to WebSocket...');

    const wsUrl = `${host}/api2/json/nodes/${node}/qemu/${vmId}/vncwebsocket?port=${vncData.port}&vncticket=${encodeURIComponent(vncData.ticket)}`;
    //console.log(wsUrl)

    const ws = new WebSocket(wsUrl, {
      headers: {
        'Cookie': cookie,
      },
      agent: httpsAgent,
    });

    ws.on('open', () => {
      console.log('WebSocket connection established.');
      console.log(vncData.port);
      console.log(vncData.ticket);


    });
    
    ws.onmessage = (message) => {
      console.log('Received message:', message.data);
      // Handle VNC traffic
  };

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    return {
      port: vncData.port,
      ticket: vncData.ticket,
  };
  } catch (error) {
    console.error('Error creating VNC proxy:', error);
    throw error;
  }
  },

createSPICEProxy: async (host, node, vmId, username, password) => {

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // Bypass SSL verification
  });

  try {
    // Get Proxmox ticket and CSRF token
    const { ticket, csrfToken } = await ProxmoxService.getProxmoxTicket(host, username, password);


    const cookie = `PVEAuthCookie=${encodeURIComponent(ticket)}`;

    // Make the request to create the SPICE proxy
    const response = await axios.post(
      `${host}/api2/json/nodes/${node}/qemu/${vmId}/spiceproxy`,
      {},
      {
        headers: {
          'Cookie': cookie,
          'CSRFPreventionToken': csrfToken,
        },
        httpsAgent,
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Error creating SPICE proxy:', error);
    throw error;
  }
},

// Function to get firewall rules of a specific VM
getVMFirewallRules: async (host, node, vmId) => {
  
  const { ticket, csrfToken } = await ProxmoxService.getProxmoxTicket(host); // Authenticate




  const httpsAgent = new https.Agent({
      rejectUnauthorized: false, // Handle self-signed certificates
  });

  const cookie = `PVEAuthCookie=${encodeURIComponent(ticket)}`;
  console.log("what he", vmId)

  try {
      const response = await axios.get(
          `${host}/api2/json/nodes/${node}/qemu/${vmId}/firewall/rules`,
          {
              headers: {
                  'Cookie': cookie,
                  'CSRFPreventionToken': csrfToken,
              },
              httpsAgent,
          }
      );

      console.log('Firewall rules retrieved successfully:', response.data);
      return response.data.data; // Return the firewall rules
  } catch (error) {
      console.error('Error retrieving firewall rules:', error);
      throw error; // Rethrow to handle in the caller function
  }
},

getVMFirewallOptions: async (host, node, vmId) => {
  
  const { ticket, csrfToken } = await ProxmoxService.getProxmoxTicket(host); // Authenticate




  const httpsAgent = new https.Agent({
      rejectUnauthorized: false, // Handle self-signed certificates
  });

  const cookie = `PVEAuthCookie=${encodeURIComponent(ticket)}`;
  

  try {
      const response = await axios.get(
          `${host}/api2/json/nodes/${node}/qemu/${vmId}/firewall/options`,
          {
              headers: {
                  'Cookie': cookie,
                  'CSRFPreventionToken': csrfToken,
              },
              httpsAgent,
          }
      );

      console.log('Firewall options retrieved successfully:', response.data);
      return response.data.data;
       // Return the firewall rules
  } catch (error) {
      console.error('Error retrieving firewall options:', error);
      throw error; // Rethrow to handle in the caller function
  }
},

getVMconfig: async (host, node, vmId) => {
  
  const { ticket, csrfToken } = await ProxmoxService.getProxmoxTicket(host); // Authenticate




  const httpsAgent = new https.Agent({
      rejectUnauthorized: false, // Handle self-signed certificates
  });

  const cookie = `PVEAuthCookie=${encodeURIComponent(ticket)}`;
  

  try {
      const response = await axios.get(
          `${host}/api2/json/nodes/${node}/qemu/${vmId}/config`,
          {
              headers: {
                  'Cookie': cookie,
                  'CSRFPreventionToken': csrfToken,
              },
              httpsAgent,
          }
      );

      console.log('Config retrieved successfully:', response.data);
      return response.data.data; // Return the firewall rules
  } catch (error) {
      console.error('Error retrieving Config:', error);
      throw error; // Rethrow to handle in the caller function
  }
},





  


};



module.exports = ProxmoxService;
