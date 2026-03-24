import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyImagesService } from '@services/propertyImages.service';

@Component({
  selector: 'app-property-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-slider.component.html',
  styleUrls: ['./property-slider.component.css']
})
export class PropertySliderComponent implements OnChanges {
  @Input() images: any[] = [];
  @Input() propertyId: number = 0;

  currentIndex = 0;
  showFullImage = false;
  isSettingMainImage = false;

  constructor(private propertyImagesService: PropertyImagesService) {}

  ngOnChanges() {
    this.currentIndex = 0;
    // Sort images: main image first
    this.images.sort((a, b) => {
      if (a.main_image && !b.main_image) return -1;
      if (!a.main_image && b.main_image) return 1;
      return 0;
    });
  }

  get currentImage() {
    return this.images[this.currentIndex];
  }

  get hasMultiple() {
    return this.images.length > 1;
  }

  get prevImage() {
    return this.images[
      this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1
    ];
  }

  get nextImage() {
    return this.images[(this.currentIndex + 1) % this.images.length];
  }

  getPrevImage() {
    return this.prevImage;
  }

  getNextImage() {
    return this.nextImage;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev() {
    this.currentIndex = this.currentIndex === 0
      ? this.images.length - 1
      : this.currentIndex - 1;
  }

  goTo(index: number) {
    this.currentIndex = index;
  }

  getUrl(image: any): string {
    const path = image?.path || image?.url || image?.image_url || '';
    if (!path) return '';

    if (path.startsWith('/')) {
      return window.location.origin + path;
    }

    return path;
  }

  getDescription(image: any): string {
    return image?.description || '';
  }

  openFullImage() {
    this.showFullImage = true;
  }

  setAsMainImage(imageId: number) {
    if (this.isSettingMainImage || !this.propertyId) return;

    this.isSettingMainImage = true;
    this.propertyImagesService.updatePropertyImageMain(this.propertyId, imageId).subscribe({
      next: (response) => {
        // Update the images array to reflect the change
        this.images.forEach(img => img.main_image = false);
        const imageIndex = this.images.findIndex(img => img.id === imageId);
        if (imageIndex !== -1) {
          this.images[imageIndex].main_image = true;
          // Re-sort to make main image first
          this.images.sort((a, b) => {
            if (a.main_image && !b.main_image) return -1;
            if (!a.main_image && b.main_image) return 1;
            return 0;
          });
          this.currentIndex = 0;
        }
        this.isSettingMainImage = false;
      },
      error: (error) => {
        console.error('Error setting main image:', error);
        this.isSettingMainImage = false;
      }
    });
  }

  closeFullImage() {
    this.showFullImage = false;
  }

  downloadImage() {
    if (!this.currentImage) return;

    const imageUrl = this.getUrl(this.currentImage);
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `property-image-${this.currentImage.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
