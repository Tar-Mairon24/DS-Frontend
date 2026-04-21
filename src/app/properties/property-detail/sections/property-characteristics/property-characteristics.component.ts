import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-characteristics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-characteristics.component.html',
  styleUrls: ['../detail.shared.css']
})
export class PropertyCharacteristicsComponent {
  @Input() property: any = null;
}
