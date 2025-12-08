import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStateService{
  private userNameSubject = new BehaviorSubject<string>('');
  private userRoleSubject = new BehaviorSubject<string>('');
  userName$ = this.userNameSubject.asObservable();
  userRole$ = this.userRoleSubject.asObservable();

  setUserName(name: string) {
    this.userNameSubject.next(name);
    localStorage.setItem('userName', name);
  }

  getUserName(): string {
    return this.userNameSubject.value || localStorage.getItem('userName') || '';
  }


  setUserRole(role: string) {
    this.userRoleSubject.next(role);
    localStorage.setItem('userRole', role);
  }

  getUserRole(): string {
    return this.userRoleSubject.value || localStorage.getItem('userRole') || '';
  }

  clearUserData() {
    this.userNameSubject.next('');
    this.userRoleSubject.next('');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
  }
}
