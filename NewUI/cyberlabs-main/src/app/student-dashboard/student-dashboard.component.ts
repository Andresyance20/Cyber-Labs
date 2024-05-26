import { Component, inject} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { CourseService } from './course.service'


@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class StudentDashboardComponent {
  currentView: string = '';
  selectedCourse: string | null = null;
  selectedLab: any = null;
  //We will need to modify this to actually include information from the SQL database
  courses: string[] = [];
  labs: any[] = [];
  selectedFile: File | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private courseService: CourseService
  ) {}
  

  // Default view when no courses are selected
  defaultView(): void {
    this.currentView = 'welcome';
    this.selectedCourse = null;
    this.selectedLab = null;
  }

  // Loads default view
  ngOnInit(): void {
    this.defaultView(); // Set the default view when the component initializes
    this.http.get<Course[]>(`http://localhost:3000/course/student/2`) //Need to have proper authentication for proper student ID
      .subscribe({
        next: (data: Course[]) => {
          this.courses = data.map(course => course.title);
        },
        error: (error) => {
          console.error('Error fetching courses:', error);
        }
      })

    console.log(this.courses);
    
  }

  //For adding files for lab submission
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  //Logic for handling the submission of a lab
  submitWork(): void {
    if (!this.selectedFile) {
      alert('Please select a file to upload.');
      return;
    }
    // Handle the file upload process, e.g., sending it to a backend server
    console.log(
      `Submitting ${this.selectedFile.name} for ${this.selectedLab.name}`
    );
    // Update lab status to completed
    this.selectedLab.status = 'Completed';
  }

  //Show the courses view in the content window
  showCourses() {
    this.currentView = 'courses';
    this.selectedCourse = null;
    this.labs = [];
  }

  //Logic for selecting a course to be able to show labs for that course
  selectCourse(course: string) {
    this.selectedCourse = course;
    this.currentView = 'labs';
    this.courseService.getLabsForCourse(course)
      .then(labs => {
        this.labs = labs;
        console.log('Course Labs:', this.labs);
      })
      .catch(error => {
        console.error('Error fetching labs:', error);
      });
  }

  //Logic for selecting a lab and show in the content window
  selectLab(lab: any) {
    this.selectedLab = lab;
    this.currentView = 'currentLab';
  }

  //This is just for dummy data for now, will need to properly incorporate database information from SQL
  getLabsForCourse(course: string): any[] {
    let courseLabs: { [key: string]: any } = {};
    this.http.get<any[]>(`http://localhost:3000/course/1/labs`)
      .subscribe({
        next: (data: any[]) => {
          const courseLabs = this.formatData(data);
          console.log(courseLabs[course]);
        },
        error: (error) => {
          console.error('Error fetching labs:', error);
        }
      });
    console.log(courseLabs);
    return courseLabs[course] || [];
  }

  private formatData(data: any[]): { [key: string]: any[] } {
    const courseLabs: { [key: string]: Lab[] } = {};
    
    data.forEach(course => {
      const labs: Lab[] = course.labs.map((lab: Lab) => ({
        name: lab.name || '',
        instructor: lab.instructor || '',
        instructions: lab.instructions || '',
        status: lab.status || '',
        submission: '', // Assuming you don't have submission data in the API response
        dueDate: '' // Assuming you don't have due date data in the API response
      }));
      
      courseLabs[course.course_title] = labs;
    });
  
    return courseLabs;
  }

  

  //Opens the VM view in a new tab
  openVmView() {
    window.open(window.location.origin + '/vm-view', '_blank');
  }

  //Logout logic, make sure to incorporate an auth system so users cannot redirect to this URL without logging in first
  logout() {
    localStorage.removeItem('SavedToken'); 
    this.router.navigate(['/login']);
  }
}

interface Course {
  id: number;
  title: string;
  number: number;
  // Add more properties as needed
}

interface Lab {
  name: string;
  status: string;
  instructor: string;
  instructions: string;
}

interface LabData {
  [courseTitle: string]: Lab[];
}