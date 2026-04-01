import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyImagesService } from '@services/propertyImages.service';
import { ErrorModalService } from '@services/error-modal.service';
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
export class PropertyMediaComponent {
  @Input() propertyId: number | null = null;

  // Replaces the old imperative setExistingImages() method.
  // Parent just binds [existingImages]="images" and Angular handles updates.
  @Input() set existingImages(images: Image[]) {
    this._existingImages = images.map(img => ({
      ...img,
      // The Image model declares `url` but the API may return `path` or `image_url`.
      // Normalise here so the template always has a reliable `url` to bind to.
      url: img.url || (img as any).path || (img as any).image_url || '',
      removed: false,
    }));
    if (this._existingImages.length > 0 && !this._existingImages.some(i => i.main_image)) {
      this._existingImages[0].main_image = true;
    }
  }
  get existingImages(): ExistingImage[] { return this._existingImages; }
  private _existingImages: ExistingImage[] = [];

  readonly MAX_FILE_SIZE = 100 * 1024 * 1024;
  readonly MAX_FILE_SIZE_MB = 100;
  slots: ImageSlot[] = [];

  constructor(
    private imagesService: PropertyImagesService,
    private errorModal: ErrorModalService,
  ) {}

  get totalImages() { return this.slots.length + this._existingImages.filter(i => !i.removed).length; }
  get canAdd() { return true; }

  openFilePicker() {
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
    const oversizedFiles: string[] = [];

    files.forEach((file, i) => {
      if (file.size > this.MAX_FILE_SIZE) {
        oversizedFiles.push(`${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        this.slots.push({
          file,
          preview: e.target?.result as string,
          description: '',
          isMain: this.totalImages === 0 && i === 0,
          uploading: false,
          uploaded: false,
        });
      };
      reader.readAsDataURL(file);
    });

    if (oversizedFiles.length > 0) {
      this.errorModal.show(
        `Los siguientes archivos superan el límite de ${this.MAX_FILE_SIZE_MB}MB:\n${oversizedFiles.join('\n')}`,
        'Archivos Demasiado Grandes'
      );
    }
  }

  setMain(index: number) {
    this.slots.forEach((s, i) => s.isMain = i === index);
    this._existingImages.forEach(img => img.main_image = false);

    const slot = this.slots[index];
    if (slot.uploaded && slot.uploadedId && this.propertyId) {
      this.imagesService.updatePropertyImageMain(this.propertyId, slot.uploadedId).subscribe({
        error: (err) => console.error('Failed to set main image:', err)
      });
    }
  }

  setMainExisting(imageId: number) {
    this.slots.forEach(s => s.isMain = false);
    this._existingImages.forEach(img => img.main_image = img.id === imageId);

    if (this.propertyId) {
      this.imagesService.updatePropertyImageMain(this.propertyId, imageId).subscribe({
        error: (err) => console.error('Failed to set main image:', err)
      });
    }
  }

  removeSlot(index: number) {
    this.slots.splice(index, 1);
    if (this.totalImages > 0 && !this.slots.some(s => s.isMain) && !this._existingImages.some(i => i.main_image && !i.removed)) {
      const firstUnremoved = this._existingImages.find(i => !i.removed);
      if (firstUnremoved) firstUnremoved.main_image = true;
      else if (this.slots.length > 0) this.slots[0].isMain = true;
    }
  }

  removeExistingImage(imageId: number) {
    const image = this._existingImages.find(i => i.id === imageId);
    if (!image) return;
    image.removed = true;
    if (image.main_image) {
      image.main_image = false;
      const next = this._existingImages.find(i => !i.removed);
      if (next) next.main_image = true;
      else if (this.slots[0]) this.slots[0].isMain = true;
    }
  }

  restoreExistingImage(imageId: number) {
    const image = this._existingImages.find(i => i.id === imageId);
    if (image) image.removed = false;
  }

  // Called by parent after property is created/saved.
  async uploadAll(): Promise<void> {
    if (!this.propertyId) return;

    // Delete removed images first, sequentially
    for (const img of this._existingImages.filter(i => i.removed)) {
      await this.deleteImage(img.id);
    }

    // Upload new images in parallel
    await Promise.all(
      this.slots.filter(s => !s.uploaded).map(slot => this.uploadSlot(slot))
    );
  }

  private deleteImage(imageId: number): Promise<void> {
    return new Promise((resolve) => {
      this.imagesService.deletePropertyImage(imageId).subscribe({
        next: () => resolve(),
        error: (err) => { console.error(`Failed to delete image ${imageId}:`, err); resolve(); }
      });
    });
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
          slot.error = err.status === 413
            ? `Archivo muy grande. Máximo ${this.MAX_FILE_SIZE_MB}MB permitido.`
            : err.status === 400 ? 'Formato de imagen inválido'
            : err.status === 500 ? 'Error del servidor. Intenta de nuevo'
            : 'Error al subir imagen';
          resolve();
        }
      });
    });
  }
}
