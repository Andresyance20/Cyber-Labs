import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { VmViewComponent } from './vm-view/vm-view.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { authGuard } from '../auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'student-dashboard', component: StudentDashboardComponent, canActivate: [authGuard] },
  { path: 'teacher-dashboard', component: TeacherDashboardComponent, canActivate: [authGuard]},
  { path: 'vm-view', component: VmViewComponent, canActivate: [authGuard] },
  { path: 'create-account', component: CreateAccountComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
  
})

export class AppRoutingModule {}

