const express = require('express'); // Import Express
const router = express.Router(); // Create a router
const ProxmoxService = require('./proxmoxManager'); // Import Proxmox service

const host = 'https://192.168.0.79:8006'; // Proxmox server address
const nodeId = 'pve'; // Default node

// Route to start a VM
router.post('/start', async (req, res) => {
  const { vmId, username, password } = req.body;

  try {
    // Get the Proxmox ticket and CSRF token
    const { ticket, csrfToken } = await ProxmoxService.getProxmoxTicket(host, username, password);

    // Start the VM
    const result = await ProxmoxService.startProxmoxVM(host, nodeId, vmId, ticket, csrfToken);

    res.json({ success: true, message: 'VM started successfully', data: result });
  } catch (error) {
    console.error('Error starting VM:', error);
    res.status(500).json({ success: false, message: 'Error starting VM' });
  }
});

// Route to shut down a VM
router.post('/shutdown', async (req, res) => {
  const { vmId, username, password } = req.body;

  try {
    // Get the Proxmox ticket and CSRF token
    const { ticket, csrfToken } = await ProxmoxService.getProxmoxTicket(host, username, password);

    // Shut down the VM
    const result = await ProxmoxService.shutdownProxmoxVM(host, nodeId, vmId, ticket, csrfToken);

    res.json({ success: true, message: 'VM shut down successfully', data: result });
  } catch (error) {
    console.error('Error shutting down VM:', error);
    res.status(500).json({ success: false, message: 'Error shutting down VM' });
  }
});

// Route to get the current status of a VM
router.get('/status', async (req, res) => {
  const { vmId, username, password } = req.body;

  try {
    // Get the Proxmox ticket and CSRF token
    const { ticket, csrfToken } = await ProxmoxService.getProxmoxTicket(host, username, password);

    // Get the VM's current status
    const result = await ProxmoxService.getProxmoxVMStatus(host, nodeId, vmId, ticket, csrfToken);

    res.json({ success: true, message: 'VM status retrieved', data: result });
  } catch (error) {
    console.error('Error getting VM status:', error);
    res.status(500).json({ success: false, message: 'Error retrieving VM status' });
  }
});


// Route to get the list of all VMs on a node
router.get('/list', async (req, res) => {
    try {
      const result = await ProxmoxService.listProxmoxVMs(host, nodeId);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error listing VMs:', error);
      res.status(500).json({ success: false, message: 'Error retrieving list of VMs' });
    }
  });

// Route to create a VNC proxy
router.post('/vncproxy', async (req, res) => {
  const { vmId } = req.body;

  try {
      const result = await ProxmoxService.createVNCProxy(host, nodeId, vmId);
      res.json({ success: true, data: result });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating VNC proxy' });
  }
});

router.post('/spiceproxy', async (req, res) => {
  console.log('starting spiceproxy')
  const { vmId, username, password } = req.body;

  try {
    // Create the SPICE proxy configuration
    const result = await ProxmoxService.createSPICEProxy(host, nodeId, vmId, username, password);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error creating SPICE proxy:', error);
    res.status(500).json({ success: false, message: 'Error creating SPICE proxy' });
  }
});

// Route to get firewall rules of a specific VM on a node
router.get('/firewall/rules', async (req, res) => {
  const { vmId } = req.query; // Extract node and VM ID from the request parameters

  try {
    

      const result = await ProxmoxService.getVMFirewallRules(host, nodeId, vmId);
      res.json({ success: true, data: result });
  } catch (error) {
      console.error('Error retrieving firewall rules:', error);
      res.status(500).json({ success: false, message: 'Error retrieving firewall rules' });
  }
});
router.get('/firewall/options', async (req, res) => {
  const { vmId } = req.query; // Extract node and VM ID from the request parameters

  try {
    

      const result = await ProxmoxService.getVMFirewallOptions(host, nodeId, vmId);
      res.json({ success: true, data: result });
  } catch (error) {
      console.error('Error retrieving firewall options:', error);
      res.status(500).json({ success: false, message: 'Error retrieving firewall options' });
  }
});

router.get('/config', async (req, res) => {
  const { vmId } = req.query; // Extract node and VM ID from the request parameters

  try {
    

      const result = await ProxmoxService.getVMconfig(host, nodeId, vmId);
      res.json({ success: true, data: result });
  } catch (error) {
      console.error('Error retrieving config:', error);
      res.status(500).json({ success: false, message: 'Error retrieving config' });
  }
});



module.exports = router;
