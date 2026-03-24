import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-notes-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-notes-view.component.html',
  styleUrls: ['../detail.shared.css', './property-notes-view.component.css']
})
export class PropertyNotesViewComponent {
  @Input() property: any = null;
}
