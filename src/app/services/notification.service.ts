import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<string>();

  constructor() { }

  // Metodo per inviare una notifica
  sendNotification(message: string) {
    this.notificationSubject.next(message);
  }

  // Metodo per sottoscriversi alle notifiche
  getNotification() {
    return this.notificationSubject.asObservable();
  }
}
