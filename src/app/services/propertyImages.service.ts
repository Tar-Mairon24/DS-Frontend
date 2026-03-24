import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '@services/http.service';
import { Image, PropertyImageMain } from '@shared/models/image';

@Injectable({
  providedIn: 'root'
})
export class PropertyImagesService extends BaseHttpService {
  getPropertyImagesByPropertyId(propertyId: number): Observable<Image[]> {
    return this.get(`/properties/${propertyId}/images`);
  }

  getPropertyMainImageByPropertyId(propertyId: number): Observable<PropertyImageMain> {
    return this.get(`/properties/${propertyId}/images/main`);
  }

  uploadPropertyImage(propertyId: number, imageData: FormData): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/properties/${propertyId}/images`,
      imageData,
      { withCredentials: true }
    );
  }

  updatePropertyImageMain(imageId: number): Observable<any> {
    return this.patch(`/properties/images/${imageId}`);
  }
}
