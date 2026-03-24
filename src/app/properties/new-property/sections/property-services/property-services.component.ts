import { Component, Input, OnInit } from '@angular/core';
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
export class PropertyServicesComponent implements OnInit {
  @Input() form!: FormGroup;

  amenities: CheckOption[] = [
    { label: 'Alberca', value: 'alberca' },
    { label: 'Jardín', value: 'quincho' },
    { label: 'Gimnasio', value: 'gimnasio' },
    { label: 'Cuarto de Servicio', value: 'cuarto_de_servicio' },
    { label: 'Seguridad 24hs', value: 'seguridad' },
  ];

  utilities: CheckOption[] = [
    { label: 'Agua Corriente', value: 'agua' },
    { label: 'Drenaje', value: 'drenaje' },
    { label: 'Electricidad', value: 'electricidad' },
    { label: 'Internet / Fibra', value: 'internet' },
    { label: 'Teléfono', value: 'telefono' },
    { label: 'Alumbrado', value: 'alumbrado' },
  ];

  gasTypes: CheckOption[] = [
    { label: 'Gas Natural', value: 'natural' },
    { label: 'Gas LP', value: 'gas_lp' },
  ];

  extras: CheckOption[] = [
    { label: 'Alarma', value: 'alarma' },
    { label: 'Aire Acond.', value: 'aire' },
    { label: 'Calefacción', value: 'calefaccion' },
    { label: 'Lavadero', value: 'lavadero' },
  ];

  // Track selected values locally
  selected: Record<string, string[]> = {
    amenities: [], utilities: [], gas_types: [], extras: []
  };

  ngOnInit() {
    this.selected['amenities']  = this.form.get('amenities')?.value  || [];
    this.selected['utilities']  = this.form.get('utilities')?.value  || [];
    this.selected['gas_types']  = this.form.get('gas_types')?.value  || [];
    this.selected['extras']     = this.form.get('extras')?.value     || [];
  }

  toggle(field: string, value: string) {
    const arr = this.selected[field];
    const idx = arr.indexOf(value);
    if (idx === -1) arr.push(value);
    else arr.splice(idx, 1);
    this.form.patchValue({ [field]: [...arr] });
  }

  isChecked(field: string, value: string): boolean {
    return this.selected[field].includes(value);
  }
}
