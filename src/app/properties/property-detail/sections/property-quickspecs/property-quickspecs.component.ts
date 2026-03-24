import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-quickspecs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-quickspecs.component.html',
  styleUrls: ['./property-quickspecs.component.css']
})
export class PropertyQuickspecsComponent {
  @Input() property: any = null;
}
