import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '@services/http.service';

@Injectable({
  providedIn: 'root'
})
export class MfaService extends BaseHttpService {
  sendMfaCode(credentials:{email: string, reason: string}): Observable<any> {
    return this.post('/email/send-verification', credentials);
  }

  verifyMfa(credentials:{email: string, code: string}): Observable<any> {
    return this.post('/email/verify', credentials);
  }

  resendMfaCode(email: string): Observable<any> {
    return this.post('/email/resend-verification', { email });
  }
}
