import { Component, ViewChild, OnInit } from '@angular/core';
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
import { Image } from '@shared/models/image';

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
export class UpdatePropertyComponent implements OnInit {
  @ViewChild(PropertyMediaComponent) mediaComponent!: PropertyMediaComponent;

  form: FormGroup;
  isSubmitting = false;
  isUpdate = true;
  propertyId: number | null = null;
  propertyImages: Image[] = []; // Passed to media component via @Input binding in template

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private imagesService: PropertyImagesService,
  ) {
    this.form = createPropertyForm(this.fb);
  }

  ngOnInit() {
    this.propertyId = +this.route.snapshot.paramMap.get('id')!;

    if (!this.propertyId || isNaN(this.propertyId) || this.propertyId <= 0) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadProperty();
    this.loadImages();
  }

  private loadProperty() {
    this.propertyService.getPropertyById(this.propertyId!).subscribe({
      next: (property: any) => {
        // patchValue reuses the existing FormGroup — no replacement, no rebinding issues
        this.form.patchValue({
          owner_id: property.owner_id,
          title: property.title,
          status: property.status,
          address: property.address ?? '',
          neighborhood: property.neighborhood ?? '',
          city: property.city,
          zone: property.zone ?? '',
          reference: property.reference ?? '',
          transaction_type: property.transaction_type,
          property_type: property.property_type,
          price: property.price,
          is_occupied: property.is_occupied ?? false,
          is_furnished: property.is_furnished ?? false,
          construction_m2: property.construction_m2 ?? 0,
          land_m2: property.land_m2 ?? 0,
          garden_m2: property.garden_m2 ?? 0,
          floors: property.floors ?? 1,
          bedrooms: property.bedrooms ?? 0,
          bathrooms: property.bathrooms ?? 0,
          garage_size: property.garage_size ?? 0,
          amenities: property.amenities ?? [],
          utilities: property.utilities ?? [],
          gas_types: property.gas_types ?? [],
          extras: property.extras ?? [],
          description: property.description ?? '',
          notes: property.notes ?? '',
        });
        this.form.markAsPristine();
      },
      error: () => this.router.navigate(['/dashboard'])
    });
  }

  private loadImages() {
    this.imagesService.getPropertyImagesByPropertyId(this.propertyId!).subscribe({
      next: (images) => { this.propertyImages = images; },
      error: (err) => console.error('Error loading images:', err)
    });
  }

  cancel() { this.router.navigate(['/dashboard']); }
  goBack() { window.history.length > 1 ? window.history.back() : this.router.navigate(['/dashboard']); }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (!this.propertyId) return;

    this.isSubmitting = true;

    const save$ = this.form.dirty
      ? this.propertyService.updateProperty(this.propertyId, this.form.value)
      : null;

    const finish = () => {
      this.mediaComponent.uploadAll().finally(() => {
        this.isSubmitting = false;
        this.router.navigate(['/dashboard']);
      });
    };

    if (save$) {
      save$.subscribe({ next: finish, error: () => { this.isSubmitting = false; } });
    } else {
      finish();
    }
  }
}
