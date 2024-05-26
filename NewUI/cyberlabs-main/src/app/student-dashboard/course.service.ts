import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private http: HttpClient) { }

  getLabsForCourse(course: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(`http://localhost:3000/course/2/labs`)
        .subscribe({
          next: (data: any[]) => {
            const courseLabs = this.formatData(data);
            resolve(courseLabs[course] || []);
          },
          error: (error) => {
            console.error('Error fetching labs:', error);
            reject(error);
          }
        });
    });
  }

  private formatData(data: any[]): { [key: string]: any[] } {
    const formattedData: { [key: string]: any[] } = {};
    data.forEach(course => {
      formattedData[course.course_title] = course.labs;
    });
    return formattedData;
  }
}