import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { AppointmentService } from '@services/appointment.service';
import { PropertyService } from '@services/property.service';
import { AppointmentDetail } from '../appointment.model';
import { PropertyCard } from '@shared/models/property';
import { AptInfoComponent } from './sections/apt-info/apt-info.component';
import { AptPeopleComponent } from './sections/apt-people/apt-people.component';
import { AptAgentsComponent } from './sections/apt-agents/apt-agents.component';
import { PropertyCardComponent } from '@properties/property-card/property-card.component';

@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [CommonModule, AptInfoComponent, AptPeopleComponent, AptAgentsComponent, PropertyCardComponent],
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.css']
})
export class AppointmentDetailComponent implements OnInit, OnDestroy {
  private sub!: Subscription;

  apt: AppointmentDetail | null = null;
  property: PropertyCard | null = null;
  isLoading = true;
  error = false;

  get statusLabel(): string {
    const map: Record<string, string> = {
      scheduled: 'Programada', completed: 'Completada', cancelled: 'Cancelada'
    };
    return this.apt ? (map[this.apt.status] ?? this.apt.status) : '';
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private aptSvc: AppointmentService,
    private propSvc: PropertyService
  ) {}

  ngOnInit() {
    this.sub = this.route.params.pipe(
      // switchMap cancels any previous in-flight requests when params change
      switchMap(params => {
        this.apt = null;
        this.property = null;
        this.isLoading = true;
        this.error = false;
        return this.aptSvc.getById(Number(params['id']));
      })
    ).subscribe({
      next: apt => {
        this.apt = apt;
        // Now fetch the property card — also cancel if appointment changes mid-flight
        this.propSvc.getPropertyCard(apt.property_id).subscribe({
          next: prop => { this.property = prop; this.isLoading = false; },
          error: ()   => { this.isLoading = false; }
        });
      },
      error: () => { this.error = true; this.isLoading = false; }
    });
  }

  ngOnDestroy() { this.sub.unsubscribe(); }

  goBack() { this.location.back(); }

  navigateToProperty() {
    if (this.apt) this.router.navigate(['/properties', this.apt.property_id]);
  }

  onPropertySelect() { this.navigateToProperty(); }
}
