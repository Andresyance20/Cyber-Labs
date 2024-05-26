const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT instructor.instructor_id,
    instructor.username,
    instructor.password,
    instructor.email,
    instructor.first_name,
    instructor.last_name
    FROM portnumber.instructor LIMIT ${offset},${config.listPerPage}`
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
    `SELECT instructor.instructor_id,
    instructor.username,
    instructor.password,
    instructor.email,
    instructor.first_name,
    instructor.last_name
    FROM portnumber.instructor WHERE instructor.instructor_id = ${id}`
  );
  const data = helper.emptyOrRows(rows); 
  return data; 
}

async function getOneByUsername(username){

  const rows = await db.query(
    `SELECT Instructor.instructor_id,
    Instructor.username,
    Instructor.password,
    Instructor.email,
    Instructor.first_name,
    Instructor.last_name
    FROM Instructor WHERE Instructor.username = '${username}'`
  );
  const data = helper.emptyOrRows(rows); 
  return data; 
}
async function create(instructor){
    const result = await db.query(`INSERT INTO Instructor 
    (username,
    password,
    email,
    first_name,
    last_name)
    VALUES
    ('${instructor.username }',
    '${instructor.password }',
    '${instructor.email }',
    '${instructor.firstname }',
    '${instructor.lastname}')`
    ); 

    let message = 'Error in creating Instructor';

    if (result.affectedRows) {
        message = 'Instructor created successfully';
    }

    return {message};
}

module.exports = {
  getMultiple,
  getOne,
  getOneByUsername,
  create
}