import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private userNameSubject = new BehaviorSubject<string>('');
  private userRoleSubject = new BehaviorSubject<string>('');
  private userEmailSubject = new BehaviorSubject<string>('');
  private mfaVerifiedSubject = new BehaviorSubject<boolean>(false);

  userName$ = this.userNameSubject.asObservable();
  userRole$ = this.userRoleSubject.asObservable();
  userEmail$ = this.userEmailSubject.asObservable();
  mfaVerified$ = this.mfaVerifiedSubject.asObservable();

  private readonly MFA_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

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

    if (verified) {
      const timestamp = Date.now().toString();
      localStorage.setItem('mfaVerifiedAt', timestamp);
    } else {
      localStorage.removeItem('mfaVerifiedAt');
    }
  }

  isMfaVerified(): boolean {
    const verifiedAt = localStorage.getItem('mfaVerifiedAt');

    if (!verifiedAt) {
      return false;
    }

    const timestamp = parseInt(verifiedAt, 10);
    const now = Date.now();
    const timeSinceVerification = now - timestamp;

    // Check if MFA verification has expired (5 minutes)
    if (timeSinceVerification > this.MFA_TIMEOUT) {
      this.setMfaVerified(false);
      return false;
    }

    return true;
  }

  clearUserData() {
    this.userNameSubject.next('');
    this.userRoleSubject.next('');
    this.userEmailSubject.next('');
    this.mfaVerifiedSubject.next(false);

    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('mfaVerifiedAt');
  }
}
