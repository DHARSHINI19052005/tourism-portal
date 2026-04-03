import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

type CredKey = 'email' | 'password';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './signin.html',
  styleUrls: ['./signin.css']
})
export class Signin {

  creds = { email: '', password: '' };
  errors: Partial<Record<CredKey, string>> = {};
  touched: Partial<Record<CredKey, boolean>> = {};
  serverError = '';
  loading = false;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService
  ) { }

  touch(field: CredKey) {
    this.touched[field] = true;
    this.validateField(field);
  }

  validateField(field: CredKey) {
    if (!this.creds[field].trim()) {
      this.errors[field] = field === 'email' ? 'Email Address is required.' : 'Password is required.';
    } else if (field === 'email') {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(this.creds.email)) {
        this.errors.email = 'Enter a valid email address.';
      } else {
        delete this.errors.email;
      }
    } else {
      delete this.errors[field];
    }
  }

  clearErrors() {
    this.serverError = '';
  }

  submit() {
    this.touched = { email: true, password: true };
    (['email', 'password'] as CredKey[]).forEach(k => this.validateField(k));
    if (Object.keys(this.errors).length > 0) return;

    this.loading = true;
    this.serverError = '';

    const err = this.authService.login(this.creds.email.trim(), this.creds.password);
    this.loading = false;

    if (err) {
      this.serverError = err;
      return;
    }

    const user = this.authService.currentUser!;
    this.notificationService.show('success', `Welcome back, ${user.fullName.split(' ')[0]}!`);
    if (user.role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/analytics']);
    }
  }
}
