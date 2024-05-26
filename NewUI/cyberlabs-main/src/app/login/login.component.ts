import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public isInstructor = false;
  constructor(private router: Router, private auth : AuthService) {}

  login(username: string, password: string) {
    this.auth.loginUser(username, password, this.isInstructor); 
    this.isInstructor ? this.router.navigate(['/teacher-dashboard']) : this.router.navigate(['/student-dashboard']);    
  }
  redirectToCreateAccount() {
    this.router.navigate(['/create-account']);
  }


  redirectToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  public onTypeChange(value:boolean){
    this.isInstructor = value; 
  }
}
