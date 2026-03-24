import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './property-details.component.html',
  styleUrls: ['../section.shared.css']
})
export class PropertyDetailsComponent {
  @Input() form!: FormGroup;

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }

  formatPrice(event: any): void {
  const input = event.target;
  let value = input.value.replace(/[^0-9]/g, '');

  if (value) {
    const numberValue = parseInt(value, 10);
    this.form.patchValue({ price: numberValue });

    const formatted = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numberValue);
      input.value = formatted;
    }
  }

  onPriceBlur(): void {
    const priceControl = this.form.get('price');
    if (priceControl?.value) {
      const formatted = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(priceControl.value);

      const input = document.querySelector('input[formControlName="price"]') as HTMLInputElement;
      if (input) {
        input.value = formatted;
      }
    }
  }

  onPriceFocus(event: any): void {
    // Show just the number when editing
    const priceControl = this.form.get('price');
    if (priceControl?.value) {
      event.target.value = priceControl.value.toString();
    }
  }
}
