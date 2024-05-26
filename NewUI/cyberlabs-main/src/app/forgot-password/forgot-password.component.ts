import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  constructor(private router: Router) {}

  forgotPassword(formValue: any) {
    const { name, email, password, verifyPassword } = formValue;
    if (password === verifyPassword) {
      alert(`Password reset link sent to ${email}! Please reset password and log back in.`);
      this.router.navigate(['/login']); // Redirect to login on successful account creation
    } 
  }
}