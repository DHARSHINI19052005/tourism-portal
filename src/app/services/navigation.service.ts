import { Injectable } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor(private router: Router) {
    this.initializeRouterEvents();
  }

  private initializeRouterEvents() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loadingSubject.next(true);
        // Simulate minimum loading time for better UX
        setTimeout(() => {
          if (this.loadingSubject.value) {
            this.loadingSubject.next(false);
          }
        }, 300);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationError ||
        event instanceof NavigationCancel
      ) {
        this.loadingSubject.next(false);
      }
    });
  }

  isLoading(): Observable<boolean> {
    return this.loading$;
  }
}
