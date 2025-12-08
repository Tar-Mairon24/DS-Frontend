import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class MfaService extends BaseHttpService {
  sendMfaCode(credentials:{email: string, reason: string}): Observable<any> {
    return this.post('/email/enviar-email-verificacion', credentials);
  }

  verifyMfa(credentials:{email: string, code: string}): Observable<any> {
    return this.post('/email/verificar-email', credentials);
  }

  resendMfaCode(email: string): Observable<any> {
    return this.post('/email/reenviar-codigo-verificacion', { email });
  }
}
