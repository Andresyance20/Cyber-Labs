import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '../Models/User';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
  imports: [FormsModule],
  standalone: true,
})


export class CreateAccountComponent {
  public isInstructor = false; 
  constructor(private router: Router, private Auth : AuthService) { }

  createAccount(formData: any) {

    var type = null; 
    this.isInstructor == true ? type = 'instructor' : type = 'student';

    const user =  new User(formData.username, formData.firstname ,formData.lastname, formData.password, formData.email, type); 

    if (user.password === formData.verifyPassword) {

      try {
        this.Auth.registerUser(user);
        console.log('Account creation successful for:', user.firstname);
        alert(`Account successfully created for ${user.firstname}! Please log in.`);
        // Ideally, connect this to your backend for actual account creation
        this.router.navigate(['/login']); // Redirect to login on successful account creation
      }
      catch(error){
        alert('error'); 
      }
      
     
    } else {
      alert('Passwords do not match');
    }
  }
  public onTypeChange(value:boolean){
    this.isInstructor = value; 
  }
}
