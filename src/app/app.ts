import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';
import { LoadingSpinnerComponent } from './components/loading-spinner.component';
import { NotificationComponent } from './components/notification.component';
import { NavigationService } from './services/navigation.service';
import { ScrollService } from './services/scroll.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, Navbar, Footer, LoadingSpinnerComponent, NotificationComponent],
  template: `
    <app-notification></app-notification>
    <app-loading-spinner [isLoading]="isLoading$ | async"></app-loading-spinner>
    <div class="app-container">
      <app-navbar *ngIf="showNavbar"></app-navbar>
      <div class="page-transition">
        <router-outlet #outlet="outlet"></router-outlet>
      </div>
      <app-footer *ngIf="showFooter"></app-footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100%;
    }

    .page-transition {
      flex: 1;
      overflow-y: auto;
      animation: pageEnter 0.3s ease-out;
    }

    @keyframes pageEnter {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class App implements OnInit {
  showNavbar = false;
  showFooter = false;
  isLoading$: Observable<boolean | null> | undefined;

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private scrollService: ScrollService
  ) {
    this.isLoading$ = this.navigationService.isLoading();
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;

      // Hide navbar and footer on auth pages
      const authPages = ['/', '/login', '/signin'];
      this.showNavbar = !authPages.includes(currentUrl);
      this.showFooter = !authPages.includes(currentUrl);
    });
  }
}
