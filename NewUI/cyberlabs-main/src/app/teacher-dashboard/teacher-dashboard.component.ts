import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for ngModel

interface StudentLabStatus {
  name: string;
  status: 'Completed' | 'In Progress' | 'Late' | 'Not Started';
  completionDateTime?: string; // Optional, only if completed
}

interface Lab {
  name: string;
  instructor: string;
  instructions: string;
  completion: string;
  submission: string;
  dueDate: string;
  studentStatuses: StudentLabStatus[]; // Array of student statuses for this lab
}

interface Course {
  name: string;
  instructor: string;
  students: Student[];
  labs: Lab[];
}

interface Student {
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class TeacherDashboardComponent {
  currentView: string = '';
  selectedCourse: Course | null = null;
  selectedLab: Lab | null = null;
  //Here, you will need to put the actual data from our SQL Database, Calling Environment Variables in a Created .env file
  courses: Course[] = [
    {
      name: 'Cybersecurity Senior Project',
      instructor: 'Mohammad Ashrafuzzaman',
      students: [
        { name: 'Zach Vivian', selected: true },
        { name: 'Nick Hipsky', selected: true },
        { name: 'Eli Brown', selected: true },
        { name: 'Timothy Lima', selected: true },
      ],
      labs: [
        {
          name: 'Lab 1: Basic Security Protocols',
          instructor: 'Mohammad Ashrafuzzaman',
          instructions: 'Complete steps on securing protocols.',
          completion: '',
          submission: '',
          dueDate: '2024-04-30',
          studentStatuses: [
            {
              name: 'Zach Vivian',
              status: 'Completed',
              completionDateTime: '2024-04-29 10:30 AM',
            },
            { name: 'Nick Hipsky', status: 'In Progress' },
            {
              name: 'Eli Brown',
              status: 'Late',
              completionDateTime: '2024-05-01 11:00 AM',
            },
            {
              name: 'Timothy Lima',
              status: 'Completed',
              completionDateTime: '2024-04-30 09:45 AM',
            },
          ],
        },
        {
          name: 'Lab 2: Threat Analysis',
          instructor: 'Mohammad Ashrafuzzaman',
          instructions: 'Analyze reported threats.',
          completion: '',
          submission: '',
          dueDate: '2024-05-15',
          studentStatuses: [
            {
              name: 'Zach Vivian',
              status: 'Completed',
              completionDateTime: '2024-05-14 02:30 PM',
            },
            {
              name: 'Nick Hipsky',
              status: 'Completed',
              completionDateTime: '2024-05-14 02:50 PM',
            },
            { name: 'Eli Brown', status: 'In Progress' },
            { name: 'Timothy Lima', status: 'Not Started' },
          ],
        },
      ],
    },
    {
      name: 'Database Design & Implementation',
      instructor: 'Mohammad Ashrafuzzaman',
      students: [
        { name: 'Zach Vivian', selected: true },
        { name: 'Nick Hipsky', selected: true },
        { name: 'Eli Brown', selected: true },
        { name: 'Timothy Lima', selected: true },
      ],
      labs: [
        {
          name: 'Lab 1: SQL Injection',
          instructor: 'Mohammad Ashrafuzzaman',
          instructions: 'Perform SQL injection on a sample database.',
          completion: '',
          submission: '',
          dueDate: '2024-04-25',
          studentStatuses: [
            { name: 'Zach Vivian', status: 'Late' },
            {
              name: 'Nick Hipsky',
              status: 'Completed',
              completionDateTime: '2024-05-14 02:50 PM',
            },
            { name: 'Eli Brown', status: 'Not Started' },
            { name: 'Timothy Lima', status: 'In Progress' },
          ],
        },
        {
          name: 'Lab 2: Data Normalization',
          instructor: 'Mohammad Ashrafuzzaman',
          instructions: 'Normalize the given database schema.',
          completion: '',
          submission: '',
          dueDate: '2024-05-05',
          studentStatuses: [
            {
              name: 'Zach Vivian',
              status: 'Completed',
              completionDateTime: '2024-05-14 02:30 PM',
            },
            {
              name: 'Nick Hipsky',
              status: 'Completed',
              completionDateTime: '2024-05-14 02:50 PM',
            },
            { name: 'Eli Brown', status: 'In Progress' },
            { name: 'Timothy Lima', status: 'In Progress' },
          ],
        },
      ],
    },
  ];
  students: Student[] = [
    { name: 'Zach Vivian', selected: false },
    { name: 'Nick Hipsky', selected: false },
    { name: 'Eli Brown', selected: false },
    { name: 'Timothy Lima', selected: false },
  ];
  newCourse = {
    name: '',
    instructor: '',
    selectedStudents: [] as Student[],
  };
  newLab: Lab = {
    name: '',
    instructor: '',
    instructions: '',
    completion: '',
    submission: '',
    dueDate: '',
    studentStatuses: [],
  };
  labs: any[] = [];
  selectedFile: File | null = null;

  constructor(private router: Router) {}

    // Default view when no courses are selected
    defaultView(): void {
      this.currentView = 'welcome';
      this.selectedCourse = null;
      this.selectedLab = null;
    }
  
    // Loads default view
    ngOnInit(): void {
      this.defaultView(); // Set the default view when the component initializes
    }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  //Logic for updating how many students have completed a lab to the 'status' section
  updateLabCompletionStatus(lab: Lab): void {
    const completedCount = lab.studentStatuses.filter(
      (s) => s.status === 'Completed'
    ).length;
    const totalStudents = lab.studentStatuses.length;
    lab.completion = `${completedCount} of ${totalStudents} Completed`;
  }

  //Logic to update student status
  changeStudentStatus(
    lab: Lab,
    studentName: string,
    status: 'Completed' | 'In Progress' | 'Late' | 'Not Started',
    dateTime?: string
  ): void {
    const student = lab.studentStatuses.find((s) => s.name === studentName);
    if (student) {
      student.status = status;
      student.completionDateTime = dateTime || student.completionDateTime;
      this.updateLabCompletionStatus(lab);
    }
  }

  //Logic for submitting PDF detailed lab instructions
  submitInstructions(): void {
    if (!this.selectedFile) {
      alert('Please select a file to upload.');
      return;
    }
    if (!this.selectedLab) {
      alert('No lab selected.');
      return;
    }
    console.log(
      `Submitting ${this.selectedFile.name} for ${this.selectedLab.name}`
    );
    this.selectedLab.completion = 'Completed';
  }

  //Switch to the create lab view in the content window
  createLab(): void {
    this.newLab = {
      name: '',
      instructor: '',
      instructions: '',
      completion: '',
      submission: '',
      dueDate: '',
      studentStatuses: [], // Initialize with an empty array
    };

    this.currentView = 'createLab';
    console.log('Switched to Create Lab view, form reset.');
  }

  //Logic for submitting new lab creation
  submitNewLab(): void {
    if (this.selectedCourse) {
      const numberOfStudents = this.selectedCourse.students.length;
      this.newLab.studentStatuses = this.selectedCourse.students.map(
        (student) => ({
          name: student.name,
          status: 'Not Started', // Assume all students are not started initially
          completionDateTime: undefined,
        })
      );

      // Initially, no students have completed the lab
      this.updateLabCompletionStatus(this.newLab); // This sets '0 of X Completed'

      // Add the new lab to the course
      this.selectedCourse.labs.push({ ...this.newLab });

      // Reset the newLab object for the next input
      this.newLab = {
        name: '',
        instructor: '',
        instructions: '',
        completion: '',
        submission: '',
        dueDate: '',
        studentStatuses: [],
      };

      this.currentView = 'labs'; // Navigate back to labs view after submission
    } else {
      alert('No course selected. Please select a course first.');
    }
  }

  //Switch to the create course view in the content window
  createCourse(): void {
    this.currentView = 'createCourse';
  }

  //Logic for handling the submission of new course data
  submitNewCourse(): void {
    this.newCourse.selectedStudents = this.students.filter(
      (student) => student.selected
    );
    this.courses.push({
      name: this.newCourse.name,
      instructor: this.newCourse.instructor,
      students: this.newCourse.selectedStudents,
      labs: [], // Assuming no labs initially
    });
    this.currentView = 'labs'; // Return to course view after submission
  }

  //Switch to the edit students form in the content window
  editStudents(): void {
    this.currentView = 'editStudents';
    this.students = this.selectedCourse ? this.selectedCourse.students : [];
  }

  //Logic for handling the submission of selected students for a course
  submitEditedStudents(): void {
    if (this.selectedCourse) {
      // Update the students array in the selected course object
      this.selectedCourse.students = this.students.filter(
        (student) => student.selected
      );
      alert('Student list updated successfully!');
      this.currentView = 'labs'; // Redirect to 'labs' view of the selected course after submission
      console.log('Returning to the labs view of:', this.selectedCourse.name);
    } else {
      alert('No course selected. Please select a course first.');
    }
  }

  //Switch to the courses view in the content window (not really used, this pops up on rare occasions, could probably remove but remove the HTML for it as well)
  showCourses() {
    this.currentView = 'courses';
    this.selectedCourse = null;
    this.labs = [];
  }

  //Logic for handling what course is selected
  selectCourse(course: Course): void {
    this.selectedCourse = course;
    if (course.labs) {
      course.labs.forEach((lab) => {
        this.updateLabCompletionStatus(lab);
      });
    }
    this.currentView = 'labs'; // Assumes you display labs in this view
    console.log('Course selected:', course.name);
    console.log('Current view set to:', this.currentView);
  }

  //Logic for handling what lab is selected
  selectLab(lab: Lab): void {
    this.selectedLab = lab;
    this.updateLabCompletionStatus(lab); // Ensure status is updated whenever a lab is selected
    this.currentView = 'currentLab';
  }

  //Switch to the edit lab view in the content window
  editLab(): void {
    if (!this.selectedLab) {
      alert('No lab selected.');
      return;
    }
    this.newLab = { ...this.selectedLab }; // Clone the selected lab to newLab for editing
    this.currentView = 'editLab'; // Set view to edit lab
    console.log('Editing lab:', this.selectedLab.name);
  }

  //Logic for handling the submission of updated lab information
  submitUpdatedLab(): void {
    if (!this.selectedLab || !this.selectedCourse) {
      alert(
        'No lab or course selected. Please select both before trying to update a lab.'
      );
      return;
    }
    const index = this.selectedCourse.labs.findIndex(
      (lab) => lab.name === this.selectedLab!.name
    );
    if (index !== -1) {
      // Apply changes to the lab
      this.selectedCourse.labs[index] = { ...this.newLab };

      // Update the completion status
      this.updateLabCompletionStatus(this.selectedCourse.labs[index]);

      alert('Lab updated successfully!');
      this.currentView = 'labs'; // Navigate back to labs view
    } else {
      alert('Lab not found.');
    }
  }

  //Fetches labs for a course when selected
  getLabsForCourse(courseName: string): Lab[] {
    const course = this.courses.find((c) => c.name === courseName);
    return course ? course.labs : [];
  }

  //Switch to the current lab view in the content window
  showCurrentLab() {
    if (!this.selectedLab) {
      this.currentView = 'currentLab';
    }
  }

  //Opens the VM view window in a new tab
  openVmView() {
    window.open(window.location.origin + '/vm-view', '_blank');
  }

  //Navigates to the login screen when logged out, this will need to be changed eventually, also the dashboards will need to check for authorization before displaying anything otherwise the user is able to change to /teacher-dashboard in the URL and can modify data as a teacher
  logout() {
    this.router.navigate(['/login']);
  }
}
