CREATE TABLE Instructor 
(
    instructor_id int(10) NOT NULL AUTO_INCREMENT, 
    username varchar(255) NOT NULL, 
    password varchar(255) NOT NULL, 
    email varchar(255) NOT NULL, 
    first_name varchar(255), 
    last_name varchar(255), 
    PRIMARY KEY (instructor_id)
);

CREATE TABLE Student 
(
    student_id int(10) NOT NULL AUTO_INCREMENT, 
    username varchar(255), 
    password varchar(255), 
    first_name varchar(255), 
    last_name varchar(255), 
    email varchar(255), 
    PRIMARY KEY (student_id)
);

CREATE TABLE Course 
(
    course_id int(10) NOT NULL AUTO_INCREMENT, 
    title varchar(255), 
    number int(10), 
    PRIMARY KEY (course_id)
);

CREATE TABLE Lab_Template 
(
    lab_id int(10) NOT NULL AUTO_INCREMENT, 
    instructor_id int(10) NOT NULL, 
    course_id int(10) NOT NULL, 
    title varchar(255), 
    image_file blob, 
    lab_link varchar(255), 
    PRIMARY KEY (lab_id)
);

CREATE TABLE Student_Lab 
(
    lab_id int(10) NOT NULL, 
    student_id int(10) NOT NULL, 
    answer_field varchar(255), 
    grade int(11), 
    status int(11), 
    PRIMARY KEY (lab_id, student_id)
);

CREATE TABLE VM_Instance 
(
    vm_id int(10) NOT NULL AUTO_INCREMENT, 
    student_id int(10) NOT NULL, 
    instructor_id int(10) NOT NULL, 
    lab_state_zst_path varchar(255), 
    open_time timestamp NULL, 
    close_time timestamp NULL, 
    PRIMARY KEY (vm_id)
);

CREATE TABLE Student_Course_Enrollment 
(
    student_id int(10) NOT NULL, 
    course_id int(10) NOT NULL, 
    PRIMARY KEY (student_id, course_id)
);

CREATE TABLE Instructor_Courses_Enrollment 
(
    course_id int(10) NOT NULL, 
    instructor_id int(10) NOT NULL, 
    PRIMARY KEY (course_id, instructor_id)
);

CREATE TABLE Lab_Information 
(
    info_id int(10) NOT NULL, 
    lab_id int(10) NOT NULL, 
    info_type varchar(255), 
    info_contents text, 
    PRIMARY KEY (info_id, lab_id)
);

ALTER TABLE Lab_Template 
ADD CONSTRAINT fk_lab_template_course_id FOREIGN KEY (course_id) REFERENCES Course (course_id);

ALTER TABLE Lab_Template 
ADD CONSTRAINT fk_lab_template_instructor_id FOREIGN KEY (instructor_id) REFERENCES Instructor (instructor_id);

ALTER TABLE Student_Lab 
ADD CONSTRAINT fk_student_lab_id FOREIGN KEY (lab_id) REFERENCES Lab_Template (lab_id);

ALTER TABLE Student_Course_Enrollment 
ADD CONSTRAINT fk_student_enrollment_student_id FOREIGN KEY (student_id) REFERENCES Student (student_id);

ALTER TABLE Student_Course_Enrollment 
ADD CONSTRAINT fk_student_enrollment_course_id FOREIGN KEY (course_id) REFERENCES Course (course_id);

ALTER TABLE VM_Instance 
ADD CONSTRAINT fk_vm_instance_course_id FOREIGN KEY (student_id) REFERENCES Student (student_id);

ALTER TABLE VM_Instance 
ADD CONSTRAINT fk_vm_instance_instructor_id FOREIGN KEY (instructor_id) REFERENCES Instructor (instructor_id);

ALTER TABLE Student_Lab 
ADD CONSTRAINT fk_student_lab_student_id FOREIGN KEY (student_id) REFERENCES Student (student_id);

ALTER TABLE Instructor_Courses_Enrollment 
ADD CONSTRAINT fk_instructor_enrollment_course_id FOREIGN KEY (course_id) REFERENCES Course (course_id);

ALTER TABLE Instructor_Courses_Enrollment 
ADD CONSTRAINT fk_instructor_enrollment_instructor_id FOREIGN KEY (instructor_id) REFERENCES Instructor (instructor_id);

ALTER TABLE Lab_Information 
ADD CONSTRAINT fk_lab_information_lab_id FOREIGN KEY (lab_id) REFERENCES Lab_Template (lab_id);
