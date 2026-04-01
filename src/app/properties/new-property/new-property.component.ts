import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PropertyMediaComponent } from './sections/property-media/property-media.component';
import { PropertyLocationComponent } from './sections/property-location/property-location.component';
import { PropertyDetailsComponent } from './sections/property-details/property-details.component';
import { PropertyServicesComponent } from './sections/property-services/property-services.component';
import { PropertyNotesComponent } from './sections/property-notes/property-notes.component';
import { PropertyService } from '@services/property.service';
import { createPropertyForm } from '@shared/utils/property-form.utils';

@Component({
  selector: 'app-new-property',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PropertyMediaComponent,
    PropertyLocationComponent,
    PropertyDetailsComponent,
    PropertyServicesComponent,
    PropertyNotesComponent,
  ],
  templateUrl: './new-property.component.html',
  styleUrls: ['./new-property.component.css']
})
export class NewPropertyComponent {
  @ViewChild(PropertyMediaComponent) mediaComponent!: PropertyMediaComponent;

  form: FormGroup;
  isSubmitting = false;
  isUpdate = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private propertyService: PropertyService
  ) {
    this.form = createPropertyForm(this.fb);
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

  goBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    this.router.navigate(['/dashboard']);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.propertyService.createProperty(this.form.value).subscribe({
      next: (response) => {
        const propertyId = response?.id || response?.data?.id;
        if (propertyId && this.mediaComponent) {
          this.mediaComponent.propertyId = propertyId;
          this.mediaComponent.uploadAll().then(() => {
            this.router.navigate(['/dashboard']);
          }).catch(() => {
            console.warn('Some images failed to upload, navigating to dashboard');
            this.router.navigate(['/dashboard']);
          });
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        console.error('Error creating property:', err);
        this.isSubmitting = false;
      }
    });
  }
}
