import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification.service';
import { AuthService, UserProfile } from '../services/auth.service';

type EditableKey = 'fullName' | 'email' | 'phone';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './profile.html',
    styleUrls: ['./profile.css']
})
export class Profile implements OnInit {

    form: UserProfile = {
        username: '',
        fullName: '',
        email: '',
        phone: '',
        password: '',
        role: 'user'
    };

    errors: Partial<Record<EditableKey, string>> = {};
    touched: Partial<Record<EditableKey, boolean>> = {};
    loading = false;

    get userInitial(): string {
        return (this.form.username || this.form.fullName || '?')[0].toUpperCase();
    }

    constructor(
        private router: Router,
        private notificationService: NotificationService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        // Guard: redirect if not logged in
        const user = this.authService.currentUser;
        if (!user) {
            this.router.navigate(['/signin']);
            return;
        }
        this.form = { ...user };
    }

    touch(field: EditableKey) {
        this.touched[field] = true;
        this.validate();
    }

    validate(): boolean {
        const e: Partial<Record<EditableKey, string>> = {};

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

        this.errors = e;
        return Object.keys(e).length === 0;
    }

    saveChanges() {
        (['fullName', 'email', 'phone'] as EditableKey[]).forEach(k => (this.touched[k] = true));
        if (!this.validate()) return;

        this.loading = true;
        setTimeout(() => {
            this.authService.updateProfile({
                fullName: this.form.fullName.trim(),
                email: this.form.email.trim().toLowerCase(),
                phone: this.form.phone.trim()
            });
            this.loading = false;
            this.notificationService.show('success', 'Profile updated successfully!');
        }, 400);
    }

    logout() {
        this.authService.logout();
        this.notificationService.show('info', 'You have been logged out.');
        this.router.navigate(['/signin']);
    }
}
