import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-services-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-services-view.component.html',
  styleUrls: ['../detail.shared.css']
})
export class PropertyServicesViewComponent {
  @Input() property: any = null;

  hasItems(arr: any): boolean {
    return Array.isArray(arr) && arr.length > 0;
  }
}
