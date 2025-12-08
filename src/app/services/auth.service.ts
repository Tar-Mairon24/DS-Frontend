import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseHttpService {
  login(credentials: { email: string; password: string; captcha: string }): Observable<any> {
    return this.post('/login', credentials);
  }

  register(user: { nombre: string; email: string; role: string; password: string }): Observable<any> {
    return this.post('/users/create', user);
  }

  logout(): Observable<any> {
    return this.post('/logout', {});
  }

  verifyAuth(): Observable<any> {
    return this.get('/auth/verify');
  }
}
