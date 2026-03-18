import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '@services/http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseHttpService {
  login(credentials: { email: string; password: string; captcha: string }): Observable<any> {
    return this.post('/auth/login', credentials);
  }

  logout(id: string ): Observable<any> {
    return this.post(`/auth/logout/${id}`, { id });
  }

  verifyAuth(): Observable<any> {
    return this.get('/auth/status');
  }
}
