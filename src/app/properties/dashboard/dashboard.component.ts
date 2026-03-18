import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { EmptyStateComponent } from '@shared/components/errors/empty-state.component';
import { PropertyService } from '@services/property.service';
import { UserStateService } from '@services/user-state.service';
import { Property } from '@models/property';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    PropertyCardComponent,
    EmptyStateComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  properties: Property[] = [];
  showDeleteConfirm = false;
  propertyToDelete: number | null = null;

  constructor(
    private router: Router,
    private propertyService: PropertyService,
    private userStateService: UserStateService
  ) {}

  ngOnInit(): void {
    this.fetchProperties();
  }

  fetchProperties(): void {
    this.propertyService.getAllProperties().subscribe({
      next: (data) => { this.properties = data; },
      error: (err) => {
        console.error('Error fetching properties:', err);
        this.properties = [];
        if (err.status === 401) this.router.navigate(['/login']);
      }
    });
  }

  showDetails(property: Property): void {
    this.router.navigate(['/property', property.id]);
  }

  handleEdit(propertyId: number): void {
    this.router.navigate(['/property/edit', propertyId]);
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
    this.router.navigate(['/property/new']);
  }
}
