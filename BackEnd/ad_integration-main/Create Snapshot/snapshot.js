const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to prompt the user for Proxmox base URL, username, and password
async function promptUser() {
    const baseUrl = await new Promise((resolve) => {
        rl.question('Enter Proxmox base URL (e.g., https://your-proxmox-host): ', (answer) => {
            resolve(answer);
        });
    });

    const username = await new Promise((resolve) => {
        rl.question('Enter Proxmox username: ', (answer) => {
            resolve(answer);
        });
    });

    const password = await new Promise((resolve) => {
        rl.question('Enter Proxmox password: ', (answer) => {
            resolve(answer);
        });
    });

    rl.close();

    return { baseUrl, username, password };
}

// Function to create a backup of a virtual machine
async function createBackupAndShutdown(node, vmId, backupName, { baseUrl, username, password }) {
    try {
        // Login to Proxmox API to obtain authentication token
        const loginResponse = await axios.post(`${baseUrl}/api2/json/access/ticket`, {
            username,
            password,
            realm: 'pam',
        });

        const token = loginResponse.data.data.ticket;

        // Create a backup of the virtual machine
        const response = await axios.post(`${baseUrl}/api2/json/nodes/${node}/qemu/${vmId}/snapshot`, {
            snapname: backupName,
            vmstate: 1, // Take a snapshot while the VM is running
            description: 'Backup snapshot', // Optional description for the snapshot
        }, {
            headers: {
                'CSRFPreventionToken': token,
                'Cookie': `PVEAuthCookie=${loginResponse.data.data.ticket}`,
            },
        });

        console.log(`Backup snapshot '${backupName}' created successfully for virtual machine ${vmId}.`);

        // Get backup file
        const backupResponse = await axios.get(`${baseUrl}/api2/json/nodes/${node}/qemu/${vmId}/snapshot/${backupName}/config`, {
            headers: {
                'CSRFPreventionToken': token,
                'Cookie': `PVEAuthCookie=${loginResponse.data.data.ticket}`,
            },
        });

        const backupFileUrl = backupResponse.data.data.snap;

        // Download backup file
        const writer = fs.createWriteStream(`${backupName}.zst`);
        const responseStream = await axios.get(backupFileUrl, { responseType: 'stream' });
        responseStream.data.pipe(writer);

        console.log(`Backup file '${backupName}.zst' downloaded successfully.`);

        // Shutdown the virtual machine
        await axios.post(`${baseUrl}/api2/json/nodes/${node}/qemu/${vmId}/status/shutdown`, null, {
            headers: {
                'CSRFPreventionToken': token,
                'Cookie': `PVEAuthCookie=${loginResponse.data.data.ticket}`,
            },
        });

        console.log(`Virtual machine ${vmId} is shutting down...`);
    } catch (error) {
        console.error('Error creating backup:', error.response ? error.response.data : error.message);
    }
}

// Main function to prompt user and create backup
async function main() {
    const { baseUrl, username, password } = await promptUser();
    const node = 'pve'; // Replace with the desired node name
    const vmId = '100'; // Replace with the desired virtual machine ID
    const backupName = 'webserver-backup'; // Replace with the desired backup name

    await createBackupAndShutdown(node, vmId, backupName, { baseUrl, username, password });
}

// Execute main function
main();
