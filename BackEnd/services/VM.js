const db = require('./db');
const helper = require('../helper');
var Proxmox = require("proxmox")('root', '', '192.168.56.102');

async function getOne(id){

    const rows = await db.query(
        `SELECT vm_instance.vm_id,
        vm_instance.student_id,
        vm_instance.instructor_id,
        vm_instance.lab_state_zst,
        vm_instance.open_time,
        vm_instance.close_time
        FROM portnumber.vm_instance WHERE vm_instance.vm_id = ${id}`
    );
    const data = helper.emptyOrRows(rows); 
    return data; 
}

async function create(VM){
    const rows = await db.query(
    `INSERT INTO portnumber.vm_instance
    (vm_id,
    student_id,
    instructor_id,
    lab_state_zst,
    open_time,
    close_time)
    VALUES
    (${VM.vm_id },
    ${VM.student_id },
    ${VM.instructor_id },
    '${VM.lab_state_zst }',
    ${VM.open_time },
    ${VM.close_time})`
    );

    let message = 'Error in creating VM';

    if (result.affectedRows) {
        message = 'VM created successfully';
    }

    return {message};
}
/* Needs Testing */
async function remove(VM){
    const rows = await db.query(`
    DELETE FROM vm_instance WHERE vm_id = ${VM.vm_id}`);  
    let message = 'Error in deleting VM_Instance From Database';
    if (result.affectedRows) {
        message = 'VM_Instance deleted successfully From Database';
    }

    Proxmox.pmModule.deleteQemu('pve', VM.vm_id, function(err, data) {
      if (err) {
        message += ', error in deleting from Proxmox';
      } else {
       message += ', successfully deleted from Proxmox';
      }
    });

   return {message};
}

async function start(VM){
    let message = ''; 
    Proxmox.pmModule.start('pve', VM.vm_id,function(err, data) {
        if (err) {
           message = 'error in starting Proxmox VM instance';
        } else {
           message = 'successfully started Proxmox VM instance';
        }
        
    });

    return {message}; 
}



module.exports = {
    getOne,
    create,
    remove,
    start
  }