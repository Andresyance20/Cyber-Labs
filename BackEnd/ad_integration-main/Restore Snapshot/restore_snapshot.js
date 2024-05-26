const mysql = require('mysql');
const axios = require('axios');
const fs = require('fs');
const readline = require('readline');
const { get } = require('https');

// MySQL database configuration
const dbConfig = {
  host: 'your_mysql_host',
  user: 'your_mysql_user',
  password: 'your_mysql_password',
  database: 'your_mysql_database'
};

// Proxmox configuration
const proxmoxConfig = {
  baseURL: 'enter_base_url',
  username: 'enter_username',
  password: 'enter_password',
  realm: 'enter_realm'
};


// Function to send snapshot data to Proxmox for restoration
function restoreSnapshot(snapshotData) {

  const proxmoxConfig = getProxmoxConfiguration();

  // Construct URL for Proxmox API endpoint
  const url = `${proxmoxConfig.baseUrl}/nodes/${proxmoxConfig.node}/qemu/${proxmoxConfig.vmID}/snapshot/${snapshotData.snapshotID}/rollback`;

  // Axios POST request to Proxmox API for snapshot rollback
  axios.post(url, {}, {
    auth: {
      username: proxmoxConfig.username,
      password: proxmoxConfig.password
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((response) => {
    console.log('Snapshot restoration successful:', response.data);
  })
  .catch((error) => {
    console.error('Snapshot restoration failed:', error.response.data);
  });
}


// TODO: Get student username
function getUsername(){
  
  return 'username';
}

async function main(){

  const username = getUsername();

  // Establish MySQL connection
  const connection = mysql.createConnection(dbConfig);

  // Connect to MySQL
  connection.connect((err) => {
    // Check for error in the database connection
    if (err) {
      console.error('Error connecting to MySQL: ' + err.stack);
      return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);


    const student_id = null;
    // Query to get student ID
    const queryUserID = 'SELECT student_id FROM Student WHERE username="' + username + '"';
    // Execute the query to get user_id
    connection.query(queryUserID, (error, results, fields) => {
      // Check for error in the query execution
      if (error) {
        console.error('Error querying MySQL: ' + error.stack);
        return;
      }

      // Assuming the snapshot data is in results[0]
      const student_id = results[0];
    });


    // Query to get the backup mode snapshot from MySQL
    const queryGetZST = 'SELECT lab_state_zst FROM VM_Instance WHERE student_id="' + student_id + '"';
    // Execute the query to get zst file
    connection.query(queryGetZST, (error, results, fields) => {
      if (error) {
        console.error('Error querying MySQL: ' + error.stack);
        return;
      }

      // Assuming the snapshot data is in results[0]
      const snapshotData = results[0];

      // Send the snapshot to Proxmox for VM restoration
      restoreSnapshot(snapshotData);
    });
  });

  // Close MySQL connection when done
  connection.end();

}

// Execute main function
main();
