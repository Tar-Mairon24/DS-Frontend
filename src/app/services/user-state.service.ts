import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStateService{
  private userNameSubject = new BehaviorSubject<string>('');
  private userRoleSubject = new BehaviorSubject<string>('');
  private userEmailSubject = new BehaviorSubject<string>('');
  private mfaVerifiedSubject = new BehaviorSubject<boolean>(false);
  userName$ = this.userNameSubject.asObservable();
  userRole$ = this.userRoleSubject.asObservable();
  userEmail$ = this.userEmailSubject.asObservable();
  mfaVerified$ = this.mfaVerifiedSubject.asObservable();

  setUserName(name: string) {
    this.userNameSubject.next(name);
    localStorage.setItem('userName', name);
  }

  getUserName(): string {
    return this.userNameSubject.value || localStorage.getItem('userName') || '';
  }

  setUserEmail(email: string) {
    this.userEmailSubject.next(email);
    localStorage.setItem('userEmail', email);
  }

  getUserEmail(): string {
    return this.userEmailSubject.value || localStorage.getItem('userEmail') || '';
  }

  setUserRole(role: string) {
    this.userRoleSubject.next(role);
    localStorage.setItem('userRole', role);
  }

  getUserRole(): string {
    return this.userRoleSubject.value || localStorage.getItem('userRole') || '';
  }

  setMfaVerified(verified: boolean) {
    this.mfaVerifiedSubject.next(verified);
  }

  isMfaVerified(): boolean {
    return this.mfaVerifiedSubject.value;
  }

  clearUserData() {
    this.userNameSubject.next('');
    this.userRoleSubject.next('');
    this.userEmailSubject.next('');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
  }
}
