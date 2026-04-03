import { Routes } from '@angular/router';

import { Explore } from './explore/explore';
import { Login } from './login/login';
import { Signin } from './signin/signin';
import { Home } from './home/home';
import { Destinations } from './destinations/destinations';
import { BookingComponent } from './booking/booking';
import { Contact } from './contact/contact';
import { Profile } from './profile/profile';
import { BookingAnalytics } from './booking-analytics/booking-analytics';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';

import { userGuard, adminGuard, authGuard } from './guards/auth.guard';

export const routes: Routes = [

  // First page (Landing Page) — show Signin hero first per request
  { path: '', component: Signin },

  // Auth pages
  { path: 'login', component: Login },
  { path: 'signin', component: Signin },

  // Profile
  { path: 'profile', component: Profile, canActivate: [authGuard] },

  // Main App Pages
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'destinations', component: Destinations, canActivate: [authGuard] },
  { path: 'booking', component: BookingComponent, canActivate: [authGuard] },
  { path: 'contact', component: Contact, canActivate: [authGuard] },

  // Analytics Dashboards
  { path: 'analytics', component: BookingAnalytics, canActivate: [userGuard] },
  { path: 'admin', component: AdminDashboard, canActivate: [adminGuard] }

];
