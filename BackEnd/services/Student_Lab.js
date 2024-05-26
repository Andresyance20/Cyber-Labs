const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT student_lab.lab_id,
    student_lab.student_id,
    student_lab.answer_field,
    student_lab.grade,
    student_lab.completion_status
    FROM portnumber.student_lab LIMIT ${offset},${config.listPerPage}`
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
      `SELECT student_lab.lab_id,
      student_lab.student_id,
      student_lab.answer_field,
      student_lab.grade,
      student_lab.completion_status
      FROM portnumber.student_lab WHERE student_lab.lab_id = ${id}`
    );
    const data = helper.emptyOrRows(rows); 
    return data; 
  }

module.exports = {
    getMultiple,
    getOne
}
