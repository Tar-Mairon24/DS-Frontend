import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-slider.component.html',
  styleUrls: ['./property-slider.component.css']
})
export class PropertySliderComponent implements OnChanges {
  @Input() images: any[] = [];

  currentIndex = 0;
  showFullImage = false;

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

  closeFullImage() {
    this.showFullImage = false;
  }
}
