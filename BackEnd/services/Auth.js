const bcrypt = require('bcrypt');
const StudentService = require('./Student');
const InstructorService = require('./Instructor');
const jwt = require('jsonwebtoken');
const  JWT_SECRET_KEY='bfew78p48rn20rr'
const JWT_EXPIRES_IN = '24h';
const db = require('./db');


const saltRounds = 10;

async function existsInStudentsOrInstructors(column, value) {
    const queryStudent = `SELECT 1 FROM Student WHERE '${column}' = ? LIMIT 1`;
    const queryInstructor = `SELECT 1 FROM Instructor WHERE '${column}'= ? LIMIT 1`;

    // Check in Student table
    const students = await db.query(queryStudent, [value]);
    if (students.length > 0) {
        return true; // Found in Student table
    }

    // Check in Instructor table
    const instructors = await db.query(queryInstructor, [value]);
    if (instructors.length > 0) {
        return true; // Found in Instructor table
    }

    return false; // Not found in either table
}


async function signup(user) {

    
    // Check for username
    const usernameExists = await existsInStudentsOrInstructors('username', user.username);
    if (usernameExists) {
        return { success: false, message: 'Username is already taken' };
    }
   
    // Check for email
    const emailExists = await existsInStudentsOrInstructors('email', user.email);
    if (emailExists) {
        return { success: false, message: 'Email is already in use' };
    }

    // hash passwords 
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
   
    // set data for database
    const userData = {
        username: user.username,
        password: hashedPassword,
        email : user.email,
        first_name: user.firstName,
        last_name: user.lastName,
    };

    //check if student or instructor 
    if (user.type === 'student') {
        return await StudentService.create(userData);
    } else if (user.type === 'instructor') {
        return await InstructorService.create(userData);
    } else {
        throw new Error('Invalid user type');
    }
}

async function authenticate(username, password, isInstructor) {
    let user = null;
    let userType = null;
    let userId = null;
    
    // Try to find the user either in Student or Instructor collections

    if(isInstructor == false){
        user = await StudentService.getOneByUsername(username);
        userType = 'student';
        if (user.length != 0) {
            userId = user.student_id;
        }
    }
    
    else {
        user = await InstructorService.getOneByUsername(username);
        userType = 'instructor';
        if (user.length != 0) {
            userId = user.instructor_id; 
        }
    }

    // If user not found in both collections
    if (user.length == 0) {
        return { success: false, message: 'User not found', token: "" };
    }
    // Compare the hashed password
    const match = await bcrypt.compare(password, user[0].password);
    if (match) {
        // User authenticated successfully, create a JWT
        const tokenPayload = {
            userId: userId,
            username: user.username,
            userType: userType
        };


        const token = jwt.sign(tokenPayload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });

        // Return the JWT instead of user details directly
        return { 
            success: true, 
            message: 'Authentication successful',
            token: token // Include the token in the response
        };
    } else {
        // Password does not match
        return { success: false, message: 'Password is incorrect', token: "" };
    }

}
async function getUserProfile(userId, userType) {
    let query;
    if (userType === 'student') {
        query = 'SELECT * FROM Student WHERE student_id = ?';
    } else if (userType === 'instructor') {
        query = 'SELECT * FROM Instructor WHERE instructor_id = ?';
    } else {
        throw new Error('Invalid user type');
    }

    try {
        const [userData] = await db.query(query, [userId]);
        //console.log(userData); // Check the output right after the query
        return userData;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}


module.exports = { signup, authenticate, getUserProfile };
