const db = require('./db')
const helper = require('../helper');
const config = require('../config');


async function getMultiple(page = 1){
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT lab_template.lab_id,
        lab_template.instructor_id,
        lab_template.course_id,
        lab_template.title,
        lab_template.instruction_pdf,
        lab_template.image_file,
        lab_template.lab_link
        FROM cyber_lab.lab_template LIMIT ${offset},${config.listPerPage}`
    );
    const data = helper.emptyOrRows(rows);
    const meta = {page};
    return {
        data,
        meta
    }
}
async function getOne(id){

    const rows = await db.query(
      `SELECT lab_template.lab_id,
      lab_template.instructor_id,
      lab_template.course_id,
      lab_template.title,
      lab_template.instruction_pdf,
      lab_template.image_file,
      lab_template.lab_link
      FROM cyber_lab.lab_template WHERE lab_template.lab_id = ${id}`
    );
    const data = helper.emptyOrRows(rows); 
    return data; 
  }

  async function create(lab) {
    const result = await db.query(
        `INSERT INTO cyber_lab.lab_template 
        (lab_id, instructor_id, course_id, title, instruction_pdf, image_file, lab_link) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,  
        [
            lab.lab_id,
            lab.instructor_id, 
            lab.course_id, 
            lab.title,
            lab.instruction_pdf || null, // Default to null if undefined
            lab.image_file || null, // Default to null if undefined
            lab.lab_link || null // Default to null if undefined
        ]
    );

    let message = 'Error in creating Lab Template';
    if (result.affectedRows) {
        message = 'Lab Template created successfully';
    }

    return {message};
}



module.exports = {
  getMultiple,
  getOne,
  create
}