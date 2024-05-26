const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
      `SELECT student.student_id,
      student.username,
      student.password,
      student.email,
      student.first_name,
      student.last_name
      FROM student LIMIT ${offset},${config.listPerPage}`
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
      `SELECT student.student_id,
      student.username,
      student.password,
      student.email,
      student.first_name,
      student.last_name
      FROM student WHERE student.student_id = ${id}`
    );
    const data = helper.emptyOrRows(rows); 
    return data; 
  }

  async function getOneByUsername(username){
    const rows = await db.query(
      `SELECT Student.student_id,
      Student.username,
      Student.password,
      Student.email,
      Student.first_name,
      Student.last_name
      FROM Student WHERE Student.username = '${username}'`
    );
    const data = helper.emptyOrRows(rows); 
    return data; 
  }
  
  async function create(student){
      const result = await db.query(`INSERT INTO Student
      (username,
      password,
      first_name,
      last_name,
      email)
      VALUES
      ('${student.username }',
      '${student.password }',
      '${student.first_name }',
      '${student.last_name }',
      '${student.email }')`
      ); 
  
      let message = 'Error in creating programming language';
  
      if (result.affectedRows) {
          message = 'Student created successfully';
      }
  
      return {message};
  }

module.exports = {
    getMultiple,
    getOne,
    create,
    getOneByUsername
  }