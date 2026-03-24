import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PropertyMediaComponent } from '../new-property/sections/property-media/property-media.component';
import { PropertyLocationComponent } from '../new-property/sections/property-location/property-location.component';
import { PropertyDetailsComponent } from '../new-property/sections/property-details/property-details.component';
import { PropertyServicesComponent } from '../new-property/sections/property-services/property-services.component';
import { PropertyNotesComponent } from '../new-property/sections/property-notes/property-notes.component';
import { PropertyService } from '@services/property.service';
import { PropertyImagesService } from '@services/propertyImages.service';
import { createPropertyForm } from '@shared/utils/property-form.utils';
import { PropertyFormData } from '@shared/models/property-form.model';

@Component({
  selector: 'app-update-property',
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
  templateUrl: '../new-property/new-property.component.html',
  styleUrls: ['../new-property/new-property.component.css']
})
export class UpdatePropertyComponent implements OnInit, AfterViewInit {
  @ViewChild(PropertyMediaComponent) mediaComponent!: PropertyMediaComponent;

  form: FormGroup;
  isSubmitting = false;
  isLoading = true;
  propertyId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private imagesService: PropertyImagesService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = createPropertyForm(this.fb);
  }

  ngOnInit() {
    this.propertyId = +this.route.snapshot.paramMap.get('id')!;

    if (!this.propertyId || isNaN(this.propertyId) || this.propertyId <= 0) {
      console.error('Invalid property ID:', this.propertyId);
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadProperty();
  }

  ngAfterViewInit() {
    // Load images after view is initialized so ViewChild is available
    this.loadImages();
  }

  private loadProperty() {
    this.propertyService.getPropertyById(this.propertyId!).subscribe({
      next: (property: any) => {
        // Pre-populate form with existing data
        const formData: Partial<PropertyFormData> = {
          title: property.title,
          status: property.status,
          address: property.address || '',
          neighborhood: property.neighborhood || '',
          city: property.city,
          zone: property.zone || '',
          reference: property.reference || '',
          transaction_type: property.transaction_type,
          property_type: property.property_type,
          price: property.price,
          is_occupied: property.is_occupied || false,
          is_furnished: property.is_furnished || false,
          construction_m2: property.construction_m2 || 0,
          land_m2: property.land_m2 || 0,
          garden_m2: property.garden_m2 || 0,
          floors: property.floors || 1,
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          garage_size: property.garage_size || 0,
          amenities: property.amenities || [],
          utilities: property.utilities || [],
          gas_types: property.gas_types || [],
          extras: property.extras || [],
          description: property.description || '',
          notes: property.notes || '',
        };

        this.form = createPropertyForm(this.fb, formData);
      },
      error: (err) => {
        console.error('Error loading property:', err);
        this.router.navigate(['/dashboard']);
      }
    });
  }

  private loadImages() {
    if (!this.propertyId) {
      console.warn('No propertyId available for loading images');
      return;
    }

    console.log('Loading images for property:', this.propertyId);
    console.log('MediaComponent available:', !!this.mediaComponent);

    this.imagesService.getPropertyImagesByPropertyId(this.propertyId).subscribe({
      next: (images) => {
        console.log('Images loaded:', images.length, images);

        // Pass existing images to media component
        if (this.mediaComponent) {
          this.mediaComponent.setExistingImages(images);
          // Trigger change detection to ensure UI updates
          this.cdr.detectChanges();
        } else {
          console.error('MediaComponent not initialized yet');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading images:', err);
        this.isLoading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

  saveDraft() {
    console.log('Draft:', this.form.value);
    // TODO: wire up draft endpoint
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.propertyId) return;

    this.isSubmitting = true;

    // Build update payload with only updatable fields (exclude images which are handled separately)
    const formValue = this.form.value;
    const updatePayload: any = {
      title: formValue.title,
      status: formValue.status,
      address: formValue.address,
      neighborhood: formValue.neighborhood,
      city: formValue.city,
      zone: formValue.zone,
      reference: formValue.reference,
      transaction_type: formValue.transaction_type,
      property_type: formValue.property_type,
      price: formValue.price,
      is_occupied: formValue.is_occupied,
      is_furnished: formValue.is_furnished,
      construction_m2: formValue.construction_m2,
      land_m2: formValue.land_m2,
      garden_m2: formValue.garden_m2,
      floors: formValue.floors,
      bedrooms: formValue.bedrooms,
      bathrooms: formValue.bathrooms,
      garage_size: formValue.garage_size,
      amenities: formValue.amenities,
      utilities: formValue.utilities,
      gas_types: formValue.gas_types,
      extras: formValue.extras,
      description: formValue.description,
      notes: formValue.notes,
    };

    this.propertyService.updateProperty(this.propertyId, updatePayload).subscribe({
      next: () => {
        // Upload any new images
        if (this.mediaComponent) {
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
        console.error('Error updating property:', err);
        this.isSubmitting = false;
      }
    });
  }
}
