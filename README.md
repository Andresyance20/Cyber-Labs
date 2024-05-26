
# API endpoint Documentation

## Table of Contents
- [Decide on Request Types](#decide-on-request-types)
- [Create VM Endpoint](#create-vm-endpoint)
- [Proxmox LXC Creation](#proxmox-lxc-creation)
- [VM Deletion](#vm-deletion)
- [VM Update](#vm-update)
- [Node.js Server](#node-js-server) 
- [Express API](#express-api) 
- [VM Operations Router](#vm-operations-router)






## Node.js Application Structure for Handling HTTP Requests and Database Interaction
<a name="decide-on-request-types"></a>  

## Overview
This guide outlines the structure of a Node.js application using Express for handling different types of HTTP requests (GET, POST, DELETE) and interacting with a database.

## Steps

1. **Decide on Request Types**:
   - Determine which HTTP request methods (GET, POST, DELETE) you want to handle for each table or resource in your application.

2. **Create JavaScript Files**:
   - Create JavaScript files in the `route` and `service` folders with the same name to organize your routes and corresponding service logic.

3. **Routes Handling**:
   - In the `route` folder, define routes for each endpoint corresponding to the desired request type (e.g., GET, POST, DELETE).
   - Inside each route handler, call the corresponding function from the service layer to handle the business logic.

4. **Service Layer**:
   - In the `service` folder, implement methods that interact with the database.
   - These methods perform CRUD operations (Create, Read, Update, Delete) or other business logic related to the specific resource.

5. **Export Modules**:
   - Export the route handlers and service methods from their respective files so they can be imported and used elsewhere in your application.

6. **Index File Setup**:
   - In the `index.js` (or `app.js`) file of your application:
     - Use `app.use()` to mount each router at a specific endpoint path.
     - This connects the routes defined in the router files to the main application.

[Back to Top](#table-of-contents)


## API Endpoint: `/createVM`
<a name="create-vm-endpoint"></a> 

This endpoint is used to create a virtual machine (VM) on the server . 

### Request Method
- `POST`

### Request Body Parameters
- `vmid`: Unique identifier for the virtual machine.

### VM Data Object
- `name`: Name of the virtual machine.
- `ostype`: Operating system type (e.g., `l26` for Linux version 2.6).
- `ide2`: IDE configuration for ISO image.
- `memory`: Memory allocation for the VM in megabytes (MB).
- `cores`: Number of CPU cores for the VM.
- `sockets`: Number of CPU sockets for the VM.
- `net0`: Network interface configuration.
- `numa`: Non-Uniform Memory Access configuration.
- `scsi0`: SCSI configuration.
- `storage`: Storage pool or device for the VM.
- `scsihw`: SCSI hardware configuration.

### Response
- If successful, returns the data object of the created VM.
- If there's an error, logs the error message.

[Back to Top](#table-of-contents)


# Proxmox LXC Creation

This Node.js endpoint is designed to create a Linux Container (LXC) on a Proxmox server. The endpoint is accessible via an HTTP POST request. It utilizes the `express` framework for handling HTTP requests.

## Prerequisites

Before using this endpoint, ensure the following:

- Node.js is installed on your system.
- You have a Proxmox server accessible and configured.
- The Proxmox server details are correctly set in the `pmModule` (not provided in the script).

## Usage

1. **Send HTTP POST Request**:
   - Send an HTTP POST request to `/createLXC` with the required parameters in the request body.
   - Required parameter:
     - `vmid`: The ID for the new LXC container.

2. **Handling Response**:
   - Upon successful creation of the LXC container, the endpoint will respond with a success message and the ID of the created LXC container.
   - If an error occurs during the creation process, an error message will be logged, and an appropriate response will be sent.

## Endpoint Explanation
-The primary purpose of the /createVM endpoint is to facilitate the creation of virtual machines (VMs) on the server. This endpoint allows users to define the configuration of the VM they wish to create by providing relevant parameters in the request body. Upon receiving a valid request, the server generates a new VM based on the provided specifications.

### Request Parameters

- `vmid`: The ID of the new LXC container. This parameter is obtained from the request body (`req.body`).

### LXC Container Data

- The LXC container data is predefined within the endpoint. Currently, the endpoint only accepts the `vmid` parameter, while other parameters are auto-set.
- The `LXCData` object contains the following parameters:
  - `cores`: Number of CPU cores.
  - `features`: Additional features for the LXC container.
  - `memory`: Memory allocated to the LXC container (in MB).
  - `net0`: Network configuration for the LXC container.
  - `ostemplate`: OS template for the LXC container.
  - `rootfs`: Root file system storage.
  - `swap`: Swap memory allocated to the LXC container (in MB).
  - `vmid`: ID of the LXC container.

### Creating LXC Container

- The `pmModule.createLXCContainer()` function is called to create the LXC container on the Proxmox server.
- Upon successful creation, a success message is logged, and a response is sent to the client with the ID of the created LXC container.
- If an error occurs during the creation process, an error message is logged, and an appropriate response is sent to the client.

## Error Handling

- Errors that occur during the creation process are caught and logged to the console.
- An appropriate error response is sent to the client.


[Back to Top](#table-of-contents)

# VM Deletion

This Node.js script is designed to delete a virtual machine (VM) from a Proxmox server by removing its configuration file. It utilizes the `fs` (File System) and `path` modules in Node.js.

## Prerequisites

Before using this script, ensure the following:

- Node.js is installed on your system.
- You have appropriate permissions to access the Proxmox server configuration files.
- You have the VM ID (`vmIdToDelete`) that you want to delete.

## Usage

1. **Adjust Configuration**:
   - Open the script file (`delete_vm.js`) in a text editor.
   - Modify the `proxmoxConfigPath` variable to match the path where Proxmox server configuration files are stored.
   - Set the `vmIdToDelete` variable to the ID of the VM you wish to delete.

2. **Run the Script**:
   - Open a terminal or command prompt.
   - Navigate to the directory where the script file is located.
   - Run the script using the command: `node delete_vm.js`.

## Script Explanation
- The /deleteVM endpoint allows users to delete a virtual machine (VM) from the server by removing its configuration files. This functionality is crucial for managing server resources efficiently and disposing of unnecessary VMs. Users can specify the VM to be deleted by providing its unique identifier (vmid) in the request body.
### Required Modules

- `fs`: File System module to interact with file system operations.
- `path`: Module to handle file paths.

### Proxmox Server Details

- `proxmoxConfigPath`: Path to the directory containing Proxmox server configuration files. Modify this path according to your Proxmox setup.
- `vmIdToDelete`: The ID of the VM you want to delete. Change this to the desired VM ID.

### Function: `deleteVm()`

This function deletes the VM by removing its configuration file.

1. **Determine VM Configuration File Path**:
   - Constructs the path to the VM configuration file using `path.join()`.

2. **Delete VM**:
   - Checks if the VM configuration file exists using `fs.existsSync()`.
   - If the file exists, it deletes the configuration file using `fs.unlinkSync()`.
   - Logs success or failure messages accordingly.

### Calling `deleteVm()`

- Calls the `deleteVm()` function to initiate the deletion process.

## Error Handling

- Any errors that occur during the deletion process are caught and logged to the console.


[Back to Top](#table-of-contents)

# VM Update 

This Node.js endpoint is designed to update the configuration of a virtual machine (VM) on a Proxmox server. It utilizes the `axios` library for making HTTP requests. The endpoint is accessible via an HTTP POST request.

## Prerequisites

Before using this endpoint, ensure the following:

- Node.js is installed on your system.
- You have a Proxmox server accessible and configured.
- The necessary permissions are set up on the Proxmox server to allow configuration updates.

## Usage

1. **Send HTTP POST Request**:
   - Send an HTTP POST request to `/updateVM` with the required parameters in the request body.
   - Required parameters:
     - `vmid`: The ID of the VM to update.
   - Optional parameters (fields to update):
     - `newname`: New name for the VM.
     - `memory`: New memory allocation for the VM.
     - `cores`: New number of CPU cores for the VM.

2. **Handling Response**:
   - Upon successful update of the VM configuration, the endpoint will respond with a success message.
   - If an error occurs during the update process, an error message will be logged, and an appropriate response will be sent.

## Endpoint Explanation
- The primary purpose of this endpoint is to facilitate seamless management of VMs, allowing administrators to adapt their configurations to meet evolving requirements or optimize resource utilization efficiently.

### Request Parameters

- `vmid`: The ID of the VM to update. This parameter is obtained from the request body (`req.body`).
- `newname`: (Optional) The new name for the VM.
- `memory`: (Optional) The new memory allocation for the VM.
- `cores`: (Optional) The new number of CPU cores for the VM.

### Updating VM Configuration

- The endpoint constructs an `updateData` object containing the fields to update based on the provided parameters.
- An HTTP PUT request is made using `axios.put()` to update the VM configuration.
- The request URL is constructed dynamically to target the specific VM configuration endpoint on the Proxmox server.
- The Proxmox server API URL, authentication credentials, and VM ID are provided as configuration options for `axios.put()`.

### Error Handling

- Errors that occur during the update process are caught and logged to the console.
- An appropriate error response is sent to the client.

## Security Note

- Ensure that the Proxmox server URL, authentication credentials (username and password), and API endpoint (`/nodes/pve/qemu/${vmid}/config`) are properly secured and not exposed to unauthorized users.


[Back to Top](#table-of-contents)

# Node js Server 
<a name="node-js-server"></a>

## Overview
This Node.js server script creates a basic HTTP server using Express.js, allowing clients to interact with various endpoints. It includes functionalities to handle GET requests, parse request bodies in JSON format, enable CORS (Cross-Origin Resource Sharing), and log received data.

## Prerequisites
Before running this server script, ensure the following dependencies are installed:
- Node.js
- Express.js

## Setup
1. Install Node.js if not already installed on your system.
2. Install Express.js and CORS dependencies using npm: npm install express cors


## Usage
1. **Run the Server Script**:
- Execute the server script using Node.js:
  ```
  node server.js
  ```
- The server will start listening for incoming requests on port 3000 by default.

2. **Access Endpoints**:
- Navigate to `http://localhost:3000` in your web browser to access the default endpoint, which returns a greeting message.
- To access the `/getName` endpoint, send a GET request to `http://localhost:3000/getName` with a `name` query parameter.

## Script Explanation
The server script (`server.js`) is responsible for creating an HTTP server using Express.js. It sets up middleware to parse incoming JSON requests and handle CORS. Additionally, it defines two endpoints:

1. **Default Endpoint ("/")**:
- Responds with a simple greeting message when accessed via a GET request.

2. **"/getName" Endpoint**:
- Handles GET requests with a `name` query parameter.
- Logs the received name to the console.
- Responds with a JSON object containing a success message and the received name.

## Dependencies
- `express`: Fast, unopinionated, minimalist web framework for Node.js.
- `cors`: Middleware for enabling Cross-Origin Resource Sharing (CORS) in Express.js applications.

## Script Structure
- **Express Setup**:
- Requires Express and CORS modules.
- Initializes Express application.
- Sets port to 3000 by default.
- Configures middleware to parse JSON requests and enable CORS.

- **Endpoints**:
1. Default endpoint ("/"):
  - Handles GET requests.
  - Sends a greeting message as response.

2. "/getName" endpoint:
  - Handles GET requests with `name` query parameter.
  - Logs received name to console.
  - Sends a JSON response with success message and received name.

- **Server Start**:
- Starts the server, listening on the specified port.
- Logs a message indicating the server is running.

## Error Handling
- The script does not include explicit error handling for simplicity. However, Express.js provides default error handling middleware for handling runtime errors.

## Security Note
- Ensure appropriate security measures are implemented, such as validating input data and protecting against common web vulnerabilities like XSS (Cross-Site Scripting) and CSRF (Cross-Site Request Forgery).
- Consider implementing authentication and authorization mechanisms if handling sensitive data or operations.

[Back to Top](#table-of-contents)

# Express API 
<a name="express-api"></a>
## Overview
This Node.js server script creates an Express API server with multiple endpoints for handling various operations related to instructors, courses, students, lab templates, and authentication. It utilizes Express.js middleware for parsing JSON and URL-encoded request bodies and includes error handling middleware for responding to errors.

## Prerequisites
Before running this server script, ensure the following dependencies are installed:
- Node.js
- Express.js

## Setup
1. Install Node.js if not already installed on your system.
2. Install Express.js using npm: npm install express


## Usage
1. **Run the Server Script**:
- Execute the server script using Node.js:
  ```
  node server.js
  ```
- The server will start listening for incoming requests on port 3000 by default.

2. **Access Endpoints**:
- Navigate to the following endpoints to access different functionalities:
  - `/`: Default endpoint returning a JSON message "ok".
  - `/instructor`: Endpoint for instructor-related operations.
  - `/course`: Endpoint for course-related operations.
  - `/student`: Endpoint for student-related operations.
  - `/lab_template`: Endpoint for lab template-related operations.
  - `/Auth`: Endpoint for authentication-related operations.

## Script Explanation
The server script (`server.js`) sets up an Express API server with various endpoints for handling different functionalities:
- Express Setup:
- Initializes Express application.
- Sets port to 3000 by default.
- Configures middleware for parsing JSON and URL-encoded request bodies.
- Endpoints:
- Defines multiple endpoints for handling instructor, course, student, lab template, and authentication operations.
- Error Handling Middleware:
- Handles errors using middleware to log errors and send appropriate error responses.

## Dependencies
- `express`: Fast, unopinionated, minimalist web framework for Node.js.

## Script Structure
- **Express Setup**:
- Requires Express module.
- Initializes Express application.
- Sets port to 3000 by default.
- Configures middleware for parsing JSON and URL-encoded request bodies.
- **Endpoints**:
- Defines multiple endpoints using Express Router for handling different functionalities.
- **Error Handling Middleware**:
- Defines middleware for handling errors and sending appropriate error responses.

## Error Handling
- The script includes error handling middleware to log errors and send appropriate error responses to clients.

## Security Note
- Ensure appropriate security measures are implemented, such as input validation, authentication, and authorization, to protect against common web vulnerabilities.

# VM Operations Router
<a name="vm-operations-router"></a> 

## Overview
This Express router script defines endpoints for performing various operations related to virtual machines (VMs). It utilizes the Express Router to create modular, mountable route handlers for handling GET, POST, and DELETE requests for VM manipulation.

## Prerequisites
Before using this router script, ensure the following dependencies are installed:
- Node.js
- Express.js

## Setup
1. Install Node.js if not already installed on your system.
2. Install Express.js using npm: npm install express


## Usage
1. **Import the Router**:
- Import the router module into your main application file:
  ```javascript
  const router = require('./routes/vmRouter');
  ```

2. **Mount the Router**:
- Mount the router on a specific path in your application:
  ```javascript
  app.use('/vm', router);
  ```

3. **Access Endpoints**:
- Access the following endpoints for VM operations:
  - `GET /vm/:id`: Get details of a specific VM by ID.
  - `DELETE /vm/:id`: Delete a VM by ID.
  - `POST /vm`: Create a new VM.
  - `POST /vm/:id`: Start a VM by ID.

## Router Explanation
This router script defines four endpoints for performing CRUD (Create, Read, Update, Delete) operations on VMs:
1. **`GET /:id` Endpoint**:
- Retrieves details of a VM by ID.
- Calls the `VM.getOne()` service method to fetch VM details.

2. **`DELETE /:id` Endpoint**:
- Deletes a VM by ID.
- Calls the `VM.remove()` service method to delete the VM.

3. **`POST /` Endpoint**:
- Creates a new VM.
- Calls the `VM.create()` service method to create a new VM.

4. **`POST /:id` Endpoint**:
- Starts a VM by ID.
- Calls the `VM.start()` service method to start the VM.

## Dependencies
- `express`: Fast, unopinionated, minimalist web framework for Node.js.

## Script Structure
- **Router Setup**:
- Requires Express module.
- Initializes Express Router.
- **Endpoints**:
- Defines endpoints for VM operations using Express Router.
- Calls corresponding service methods from the VM service (`VM.js`).
- **Error Handling Middleware**:
- Handles errors using middleware to log errors and send appropriate error responses.

## Error Handling
- The router script includes error handling middleware to log errors and send appropriate error responses to clients.

## Security Note
- Ensure appropriate security measures are implemented, such as input validation, authentication, and authorization, to protect against common web vulnerabilities.


[Back to Top](#table-of-contents)

