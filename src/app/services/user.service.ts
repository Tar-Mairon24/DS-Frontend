import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '@services/http.service';
import { UserDTO } from '@shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseHttpService {
  getUsers(): Observable<any> {
    return this.get('/users/all');
  }

  getUserById(id: string): Observable<any> {
    return this.get(`/users/${id}`);
  }

  updateUser(id: string, data: UserDTO): Observable<any> {
    return this.put(`/users/${id}`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.delete(`/users/${id}`);
  }
}
