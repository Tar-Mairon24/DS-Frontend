import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '@services/http.service';
import { Property } from '@shared/models/property';

@Injectable({
  providedIn: 'root'
})
export class PropertyService extends BaseHttpService {
  getAllProperties(): Observable<Property[]> {
    return this.get('/properties');
  }

  getPropertyById(id: number): Observable<Property> {
    return this.get(`/properties/${id}`);
  }

  createProperty(property: Property): Observable<any> {
    return this.post('/properties', property);
  }

  updateProperty(id: number, property: Property): Observable<any> {
    return this.put(`/properties/${id}`, property);
  }

  deleteProperty(id: number): Observable<any> {
    return this.delete(`/properties/${id}`);
  }
}
