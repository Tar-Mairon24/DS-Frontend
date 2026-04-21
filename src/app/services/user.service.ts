import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '@services/http.service';
import { User } from '@shared/models/user';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseHttpService {

  getUsers(type: string = 'all', search: string = ''): Observable<User[]> {
    const params = new URLSearchParams({ type });
    if (search) params.set('q', search);
    return this.get<{ data: User[] }>(`/users?${params}`).pipe(
      map(r => r.data ?? [])
    );
  }

  getOwners(search: string = ''): Observable<User[]> {
    return this.getUsers('owner', search);
  }

  getUserById(id: string): Observable<any> {
    return this.get(`/users/${id}`);
  }

  createOwner(data: { username: string; email?: string; phone?: string }): Observable<{ data: User }> {
    return this.post('/users/owners', data);
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
