const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT course.course_id,
    course.title,
    course.number
    FROM portnumber.course LIMIT ${offset},${config.listPerPage}`
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
      `SELECT course.course_id,
      course.title,
      course.number
      FROM course WHERE course.course_id = ${id}`
    );
    const data = helper.emptyOrRows(rows); 
    return data; 
}

async function getCoursesStudent(id){
  const rows = await db.query(
    `SELECT c.*
    FROM Student_Course_Enrollment sce
    JOIN Course c ON sce.course_id = c.course_id
    WHERE sce.student_id = ${id}`
  );
  const data = helper.emptyOrRows(rows); 
  return data; 
}

async function getCourseLabs(id){
  const rows = await db.query(
    `SELECT 
        c.title AS course_title,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'name', l.title,
                'instructor', CONCAT(i.first_name, ' ', i.last_name),
                'instructions', li.info_contents,
                'status', 
                    CASE
                        WHEN sl.status = 1 THEN 'Completed'
                        ELSE 'In Progress'
                    END
            )
        ) AS labs
    FROM 
        Course c
    JOIN 
        Lab_Template l ON c.course_id = l.course_id
    JOIN 
        Instructor i ON l.instructor_id = i.instructor_id
    JOIN 
        Lab_Information li ON l.lab_id = li.lab_id
    LEFT JOIN 
        Student_Lab sl ON l.lab_id = sl.lab_id AND sl.student_id = ${id}
    WHERE 
        sl.student_id = ${id}
    GROUP BY 
        c.title;`
  );

  const data = helper.emptyOrRows(rows); 
  return data; 
}


module.exports = {
    getMultiple,
    getOne,
    getCoursesStudent,
    getCourseLabs
  }