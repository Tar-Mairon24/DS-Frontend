import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-info.component.html',
  styleUrls: ['../detail.shared.css']
})
export class PropertyInfoComponent {
  @Input() property: any = null;
}
