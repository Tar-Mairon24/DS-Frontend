import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { EmptyStateComponent } from '@shared/components/errors/empty-state.component';
import { PropertyService } from '@services/property.service';
import { PropertyCard } from '@models/property';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, PropertyCardComponent, EmptyStateComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  properties: PropertyCard[] = [];
  filtered: PropertyCard[] = [];
  isLoading = true;
  showDeleteConfirm = false;
  propertyToDelete: number | null = null;
  activeFilter: string = 'all';
  sortBy: string = 'recent';

  constructor(
    private router: Router,
    private propertyService: PropertyService,
  ) {}

  ngOnInit(): void {
    this.fetchProperties();
  }

  fetchProperties(): void {
    this.isLoading = true;
    this.propertyService.getAllProperties().subscribe({
      next: (data) => {
        this.properties = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching properties:', err);
        this.properties = [];
        this.filtered = [];
        this.isLoading = false;
      }
    });
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    let result = this.activeFilter === 'all'
      ? [...this.properties]
      : this.properties.filter(p => p.transaction_type === this.activeFilter);
    this.filtered = this.sortList(result);
  }

  applySort(): void {
    this.filtered = this.sortList([...this.filtered]);
  }

  private sortList(list: PropertyCard[]): PropertyCard[] {
    switch (this.sortBy) {
      case 'price-asc':  return list.sort((a, b) => a.price - b.price);
      case 'price-desc': return list.sort((a, b) => b.price - a.price);
      default:           return list.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
  }

  showDetails(property: PropertyCard): void {
    this.router.navigate(['/properties', property.id]);
  }

  handleEdit(propertyId: number): void {
    this.router.navigate(['properties/update', propertyId]);
  }

  confirmDelete(propertyId: number): void {
    this.propertyToDelete = propertyId;
    this.showDeleteConfirm = true;
  }

  handleDeleteConfirm(): void {
    if (this.propertyToDelete) {
      this.propertyService.deleteProperty(this.propertyToDelete).subscribe({
        next: () => {
          this.properties = this.properties.filter(p => p.id !== this.propertyToDelete);
          this.applyFilter();
          this.handleDeleteCancel();
        },
        error: (err) => console.error('Error deleting property:', err)
      });
    }
  }

  handleDeleteCancel(): void {
    this.showDeleteConfirm = false;
    this.propertyToDelete = null;
  }

  addProperty(): void {
    this.router.navigate(['/properties/new-property']);
  }
}
