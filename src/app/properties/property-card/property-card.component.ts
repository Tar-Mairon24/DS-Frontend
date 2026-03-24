import {
  Component, Input, Output, EventEmitter,
  OnInit, OnDestroy, HostListener, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyCard } from '@models/property';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-card.component.html',
  styleUrls: ['./property-card.component.css']
})
export class PropertyCardComponent implements OnDestroy {
  @Input() property!: PropertyCard;
  @Input() image: string = '';

  @Output() select = new EventEmitter<PropertyCard>();
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  isMenuOpen = false;

  constructor(private elRef: ElementRef) {}

  get showBedrooms(): boolean {
    return this.property.property_type === 'Casa' ||
           this.property.property_type === 'Apartamento' ||
           this.property.property_type === 'Loft' ||
           this.property.property_type === 'Condominio';
  }

  onClick(): void {
    this.select.emit(this.property);
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.property.id);
    this.isMenuOpen = false;
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.property.id);
    this.isMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  ngOnDestroy(): void {
    // HostListener cleans up automatically
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
