import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './http.service';

export interface UserDTO {
  id: number;
  nombre: string;
  email: string;
  password: string;
  role: string;
}

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

  updateUser(id: string, data: any): Observable<any> {
    return this.put(`/users/${id}`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.delete(`/users/${id}`);
  }
}
