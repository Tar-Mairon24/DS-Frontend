import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '@services/http.service';
import { PropertyCard } from '@shared/models/property';

@Injectable({
  providedIn: 'root'
})
export class PropertyService extends BaseHttpService {
  getAllProperties(): Observable<PropertyCard[]> {
    return this.get('/properties');
  }

  getPropertyById(id: number): Observable<PropertyCard> {
    return this.get(`/properties/${id}`);
  }

  getPropertyCard(id: number): Observable<PropertyCard> {
    return this.get(`/properties/${id}/card`);
  }

  createProperty(property: PropertyCard): Observable<any> {
    return this.post('/properties', property);
  }

  updateProperty(id: number, property: PropertyCard): Observable<any> {
    return this.put(`/properties/${id}`, property);
  }

  deleteProperty(id: number): Observable<any> {
    return this.delete(`/properties/${id}`);
  }
}
