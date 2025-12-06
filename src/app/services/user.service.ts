import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3001/api/v1'; // ENDPOINT

  private users: UserDTO[] = [];

  constructor(private http: HttpClient) {}

  getUsers(users: { [param: string]: string | string[] }): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/users/all`, { params: users });
  }
}
