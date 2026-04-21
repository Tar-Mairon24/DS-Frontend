import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-property-notes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './property-notes.component.html',
  styleUrls: ['../section.shared.css']
})
export class PropertyNotesComponent {
  @Input() form!: FormGroup;
}
