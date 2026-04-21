import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-property-location',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './property-location.component.html',
  styleUrls: ['../section.shared.css']
})
export class PropertyLocationComponent {
  @Input() form!: FormGroup;

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }
}
