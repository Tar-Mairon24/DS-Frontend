import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

interface CheckOption { label: string; value: string; }

@Component({
  selector: 'app-property-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './property-services.component.html',
  styleUrls: ['../section.shared.css']
})
export class PropertyServicesComponent {
  @Input() form!: FormGroup;

  amenities: CheckOption[] = [
    { label: 'Alberca',             value: 'alberca' },
    { label: 'Jardín',              value: 'quincho' },
    { label: 'Gimnasio',            value: 'gimnasio' },
    { label: 'Cuarto de Servicio',  value: 'cuarto_de_servicio' },
    { label: 'Seguridad 24hs',      value: 'seguridad' },
  ];

  utilities: CheckOption[] = [
    { label: 'Agua Corriente',   value: 'agua' },
    { label: 'Drenaje',          value: 'drenaje' },
    { label: 'Electricidad',     value: 'electricidad' },
    { label: 'Internet / Fibra', value: 'internet' },
    { label: 'Teléfono',         value: 'telefono' },
    { label: 'Alumbrado',        value: 'alumbrado' },
  ];

  gasTypes: CheckOption[] = [
    { label: 'Gas Natural', value: 'natural' },
    { label: 'Gas LP',      value: 'gas_lp' },
  ];

  extras: CheckOption[] = [
    { label: 'Alarma',      value: 'alarma' },
    { label: 'Aire Acond.', value: 'aire' },
    { label: 'Calefacción', value: 'calefaccion' },
    { label: 'Lavadero',    value: 'lavadero' },
  ];

  isChecked(field: string, value: string): boolean {
    return (this.form.get(field)?.value ?? []).includes(value);
  }

  toggle(field: string, value: string) {
    const current: string[] = this.form.get(field)?.value ?? [];
    const idx = current.indexOf(value);
    const updated = idx === -1
      ? [...current, value]
      : current.filter((_, i) => i !== idx);
    this.form.patchValue({ [field]: updated });
  }
}
