import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyImagesService } from '@services/propertyImages.service';
import { Image } from '@shared/models/image';

interface ImageSlot {
  file: File;
  preview: string;
  description: string;
  isMain: boolean;
  uploading: boolean;
  uploaded: boolean;
  uploadedId?: number;
  error?: string;
}

interface ExistingImage extends Image {
  removed?: boolean;
}

@Component({
  selector: 'app-property-media',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-media.component.html',
  styleUrls: ['../section.shared.css', './property-media.component.css']
})
export class PropertyMediaComponent implements OnInit {
  // Pass propertyId after the property is created to enable uploads
  @Input() propertyId: number | null = null;

  readonly MAX_IMAGES = 10;
  slots: ImageSlot[] = []; // New images to upload
  existingImages: ExistingImage[] = []; // Existing images from backend

  constructor(private imagesService: PropertyImagesService) {}

  ngOnInit() {}

  get totalImages() { return this.slots.length + this.existingImages.filter(i => !i.removed).length; }
  get remaining() { return this.MAX_IMAGES - this.totalImages; }
  get canAdd() { return this.totalImages < this.MAX_IMAGES; }
  get mainIndex() { return this.slots.findIndex(s => s.isMain); }

  // Set existing images from backend (for update mode)
  setExistingImages(images: Image[]): void {
    this.existingImages = images.map(img => ({ ...img, removed: false }));
    // If no existing images marked as main, mark first new upload as main
    if (!this.existingImages.some(i => i.main_image)) {
      const firstSlot = this.slots[0];
      if (firstSlot) {
        firstSlot.isMain = true;
      }
    }
  }

  openFilePicker() {
    if (!this.canAdd) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      this.addFiles(files);
    };
    input.click();
  }

  addFiles(files: File[]) {
    const toAdd = files.slice(0, this.remaining);
    toAdd.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const isFirst = this.totalImages === 0 && i === 0;
        this.slots.push({
          file,
          preview: e.target?.result as string,
          description: '',
          isMain: isFirst,
          uploading: false,
          uploaded: false,
        });
      };
      reader.readAsDataURL(file);
    });
  }

  setMain(index: number) {
    this.slots.forEach((s, i) => s.isMain = i === index);
    this.existingImages.forEach(img => img.main_image = false);

    // If already uploaded, patch via API
    const slot = this.slots[index];
    if (slot.uploaded && slot.uploadedId && this.propertyId) {
      this.imagesService.updatePropertyImageMain(slot.uploadedId).subscribe({
        error: (err) => console.error('Failed to set main image:', err)
      });
    }
  }

  setMainExisting(imageId: number): void {
    this.slots.forEach(s => s.isMain = false);
    this.existingImages.forEach(img => img.main_image = img.id === imageId);

    this.imagesService.updatePropertyImageMain(imageId).subscribe({
      error: (err) => console.error('Failed to set main image:', err)
    });
  }

  removeSlot(index: number) {
    this.slots.splice(index, 1);
    // If removed was main, set first as main
    if (this.totalImages > 0 && !this.slots.some(s => s.isMain) && !this.existingImages.some(i => i.main_image && !i.removed)) {
      const firstUnremoved = this.existingImages.find(i => !i.removed);
      if (firstUnremoved) {
        firstUnremoved.main_image = true;
      } else if (this.slots.length > 0) {
        this.slots[0].isMain = true;
      }
    }
  }

  removeExistingImage(imageId: number) {
    const image = this.existingImages.find(i => i.id === imageId);
    if (image) {
      image.removed = true;
      // If it was main, set another as main
      if (image.main_image) {
        const nextMain = this.existingImages.find(i => !i.removed) || this.slots[0];
        if (nextMain instanceof Object && 'main_image' in nextMain) {
          nextMain.main_image = true;
        } else if (nextMain) {
          nextMain.isMain = true;
        }
      }
    }
  }

  restoreExistingImage(imageId: number) {
    const image = this.existingImages.find(i => i.id === imageId);
    if (image) {
      image.removed = false;
    }
  }

  // Called by parent after property creation/update
  async uploadAll(): Promise<void> {
    if (!this.propertyId) return Promise.resolve();
    const pending = this.slots.filter(s => !s.uploaded);
    await Promise.all(pending.map(slot => this.uploadSlot(slot)));
  }

  private uploadSlot(slot: ImageSlot): Promise<void> {
    slot.uploading = true;
    slot.error = undefined;

    const formData = new FormData();
    formData.append('image', slot.file);
    formData.append('description', slot.description);
    formData.append('main_image', String(slot.isMain));

    return new Promise((resolve) => {
      this.imagesService.uploadPropertyImage(this.propertyId!, formData).subscribe({
        next: (res) => {
          slot.uploading = false;
          slot.uploaded = true;
          slot.uploadedId = res?.id;
          resolve();
        },
        error: (err) => {
          slot.uploading = false;
          slot.error = 'Error al subir imagen';
          console.error('Upload error:', err);
          resolve();
        }
      });
    });
  }
}
