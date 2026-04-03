import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { NotificationService, Notification } from '../services/notification.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('250ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('250ms ease', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private sub!: Subscription;
  private timers: { [id: number]: Subscription } = {};

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.sub = this.notificationService.notifications$.subscribe(list => {
      this.notifications = list;
      list.forEach(n => {
        if (!this.timers[n.id]) {
          this.timers[n.id] = timer(3500).subscribe(() => this.close(n.id));
        }
      });
    });
  }

  close(id: number) {
    this.notificationService.remove(id);
    if (this.timers[id]) {
      this.timers[id].unsubscribe();
      delete this.timers[id];
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    Object.values(this.timers).forEach(t => t.unsubscribe());
  }

  getIcon(type: string) {
    switch(type) {
      case 'success': return '✔️';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '';
    }
  }
}
