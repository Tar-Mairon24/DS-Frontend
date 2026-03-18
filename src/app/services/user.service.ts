import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '@services/http.service';
import { User } from '@shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseHttpService {
  getUsers(): Observable<any> {
    return this.get('/users');
  }

  getUserById(id: string): Observable<any> {
    return this.get(`/users/${id}`);
  }

  createUser(user: User): Observable<any> {
    return this.post('/users/create', user);
  }

  updateUser(id: string, data: User): Observable<any> {
    return this.put(`/users/${id}`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.delete(`/users/${id}`);
  }
}
