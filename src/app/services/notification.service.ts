import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  icon?: string;
  timestamp?: Date;
  read?: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  private counter = 0;

  show(type: NotificationType, message: string, icon?: string) {
    const notification: Notification = {
      id: ++this.counter,
      type,
      message,
      icon,
      timestamp: new Date(),
      read: false
    };
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([...current, notification]);
    return notification.id;
  }

  remove(id: number) {
    const filtered = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(filtered);
  }

  markAsRead(id: number) {
    const updated = this.notificationsSubject.value.map(n => n.id === id ? { ...n, read: true } : n);
    this.notificationsSubject.next(updated);
  }

  clearAll() {
    this.notificationsSubject.next([]);
  }
}
