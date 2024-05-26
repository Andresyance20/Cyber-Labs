import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private http: HttpClient) { }

  // Fetch courses for a specific instructor
  getCoursesForInstructor(instructorId: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(`http://localhost:3000/instructor/courses/2`)
        .subscribe({
          next: (data: any[]) => {
            resolve(data || []);
          },
          error: (error) => {
            console.error('Error fetching courses for instructor:', error);
            reject(error);
          }
        });
    });
  }

  // Fetch labs for a specific course, similar to student but might include additional teacher-specific info
  getLabsForCourse(courseId: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(`http://localhost:3000/instructor/course/1/labs`)
        .subscribe({
          next: (data: any[]) => {
            const formattedLabs = this.formatLabsData(data);
            resolve(formattedLabs || []);
          },
          error: (error) => {
            console.error('Error fetching labs for course:', error);
            reject(error);
          }
        });
    });
  }

  private formatLabsData(data: any[]): any[] {
    return data.map(lab => ({
      name: lab.name,
      instructor: lab.instructor,
      instructions: lab.instructions,
      status: lab.status // status might include additional properties relevant to the teacher
    }));
  }
}
