import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '@services/property.service';
import { PropertyImagesService } from '@services/propertyImages.service';
import { PropertySliderComponent } from './sections/property-slider/property-slider.component';
import { PropertyQuickspecsComponent } from './sections/property-quickspecs/property-quickspecs.component';
import { PropertyInfoComponent } from './sections/property-info/property-info.component';
import { PropertyCharacteristicsComponent } from './sections/property-characteristics/property-characteristics.component';
import { PropertyServicesViewComponent } from './sections/property-services-view/property-services-view.component';
import { PropertyNotesViewComponent } from './sections/property-notes-view/property-notes-view.component';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [
    CommonModule,
    PropertySliderComponent,
    PropertyQuickspecsComponent,
    PropertyInfoComponent,
    PropertyCharacteristicsComponent,
    PropertyServicesViewComponent,
    PropertyNotesViewComponent,
  ],
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {
  property: any = null;
  images: any[] = [];
  propertyLoading = true;
  imagesLoading = true;
  showDeleteConfirm = false;

  get isLoading(): boolean {
    return this.propertyLoading || this.imagesLoading;
  }

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private location: Location,
    private propertyService: PropertyService,
    private imagesService: PropertyImagesService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || isNaN(id) || id <= 0) {
      console.error('Invalid property ID:', id);
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadProperty(id);
    this.loadImages(id);
  }

  loadProperty(id: number) {
    this.propertyService.getPropertyById(id).subscribe({
      next: (data) => {
        this.property = data;
        this.propertyLoading = false;
      },
      error: () => {
        this.propertyLoading = false;
        this.router.navigate(['/dashboard']);
      }
    });
  }

  loadImages(id: number) {
    this.imagesService.getPropertyImagesByPropertyId(id).subscribe({
      next: (imgs) => {
        this.images = imgs || [];
        this.imagesLoading = false;
      },
      error: () => {
        this.images = [];
        this.imagesLoading = false;
      }
    });
  }

  goEdit() {
    this.router.navigate(['properties/update', this.property.id]);
  }

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }

    this.router.navigate(['/dashboard']);
  }

  confirmDelete() {
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
  }

  handleDelete() {
    this.propertyService.deleteProperty(this.property.id).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => console.error('Error deleting property:', err)
    });
  }
}
