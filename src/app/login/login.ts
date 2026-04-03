import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

interface SignupForm {
  fullName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
}

type FormKey = keyof SignupForm;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  form: SignupForm = {
    fullName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: ''
  };

  errors: Partial<Record<FormKey, string>> = {};
  touched: Partial<Record<FormKey, boolean>> = {};

  serverError = '';
  loading = false;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService
  ) { }

  touch(field: FormKey) {
    this.touched[field] = true;
    this.validate();
  }

  validate(): boolean {
    const e: Partial<Record<FormKey, string>> = {};

    if (!this.form.fullName.trim()) {
      e.fullName = 'Full name is required.';
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.form.email.trim()) {
      e.email = 'Email is required.';
    } else if (!emailRe.test(this.form.email)) {
      e.email = 'Enter a valid email address.';
    }

    const phoneRe = /^\d{10}$/;
    if (!this.form.phone.trim()) {
      e.phone = 'Phone number is required.';
    } else if (!phoneRe.test(this.form.phone.replace(/\s/g, ''))) {
      e.phone = 'Enter a valid 10-digit phone number.';
    }

    if (!this.form.username.trim()) {
      e.username = 'Username is required.';
    } else if (this.form.username.length < 3) {
      e.username = 'Username must be at least 3 characters.';
    }

    if (!this.form.password) {
      e.password = 'Password is required.';
    } else if (this.form.password.length < 6) {
      e.password = 'Password must be at least 6 characters.';
    }

    if (!this.form.confirmPassword) {
      e.confirmPassword = 'Please confirm your password.';
    } else if (this.form.password !== this.form.confirmPassword) {
      e.confirmPassword = 'Passwords do not match.';
    }

    this.errors = e;
    return Object.keys(e).length === 0;
  }

  submit() {
    // Mark everything as touched
    (Object.keys(this.form) as FormKey[]).forEach(k => (this.touched[k] = true));
    if (!this.validate()) return;

    this.loading = true;
    this.serverError = '';

    const err = this.authService.register({
      fullName: this.form.fullName.trim(),
      email: this.form.email.trim().toLowerCase(),
      phone: this.form.phone.trim(),
      username: this.form.username.trim(),
      password: this.form.password
    });

    this.loading = false;

    if (err) {
      this.serverError = err;
      return;
    }

    this.notificationService.show('success', `Welcome, ${this.form.fullName.split(' ')[0]}! Your account has been created.`);
    this.router.navigate(['/analytics']);
  }
}
