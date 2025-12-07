import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class MfaService extends BaseHttpService {
  verifyMfa(credentials:{email: string, code: string}): Observable<any> {
    return this.post('/verificar-email', credentials);
  }

  resendMfaCode(email: string): Observable<any> {
    return this.post('/reenviar-codigo-verificacion', { email });
  }
}
