import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-slide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-slide.component.html',
  styleUrls: ['./image-slide.component.css']
})
export class ImageSlideComponent {
  @Input() images: string[] = [];

  currentIndex = 0;

  get hasMultiple(): boolean {
    return this.images.length > 1;
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  previous(): void {
    this.currentIndex =
      this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
  }

  goTo(index: number): void {
    this.currentIndex = index;
  }
}
