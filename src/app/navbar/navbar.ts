import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  open = false;
  dropdownOpen = false;

  isLoggedIn$: Observable<boolean>;
  userInitial$: Observable<string>;
  userName$: Observable<string>;
  userHandle$: Observable<string>;
  isAdmin$: Observable<boolean>;
  isUser$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;

    this.userInitial$ = this.authService.currentUser$.pipe(
      map(u => u ? (u.username || u.fullName || '?')[0].toUpperCase() : '?')
    );

    this.userName$ = this.authService.currentUser$.pipe(
      map(u => u ? u.fullName : '')
    );

    this.userHandle$ = this.authService.currentUser$.pipe(
      map(u => u ? u.username : '')
    );

    this.isAdmin$ = this.authService.userRole$.pipe(
      map(role => role === 'admin')
    );

    this.isUser$ = this.authService.userRole$.pipe(
      map(role => role === 'user')
    );
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
    this.open = false;
  }

  logout() {
    this.authService.logout();
    this.dropdownOpen = false;
    this.open = false;
    this.notificationService.show('info', 'You have been logged out.');
    this.router.navigate(['/signin']);
  }

  // Close dropdown when clicking outside
  @HostListener('document:click')
  onDocumentClick() {
    this.dropdownOpen = false;
  }
}
