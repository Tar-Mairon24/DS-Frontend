import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropertyFormData } from '@shared/models/property-form.model';

export function createPropertyForm(
  fb: FormBuilder,
  initialData?: Partial<PropertyFormData>
): FormGroup {
  const defaultValues: PropertyFormData = {
    images: [],
    title: '',
    status: 'Disponible',
    address: '',
    neighborhood: '',
    city: '',
    zone: '',
    reference: '',
    transaction_type: 'Venta',
    property_type: 'Casa',
    price: null as any,
    is_occupied: false,
    is_furnished: false,
    construction_m2: 0,
    land_m2: 0,
    garden_m2: 0,
    floors: 1,
    bedrooms: 0,
    bathrooms: 0,
    garage_size: 0,
    amenities: [],
    utilities: [],
    gas_types: [],
    extras: [],
    description: '',
    notes: '',
  };

  const finalValues = { ...defaultValues, ...initialData };

  return fb.group({
    images: [finalValues.images],
    title: [finalValues.title, Validators.required],
    status: [finalValues.status, Validators.required],
    address: [finalValues.address, Validators.required],
    neighborhood: [finalValues.neighborhood],
    city: [finalValues.city, Validators.required],
    zone: [finalValues.zone],
    reference: [finalValues.reference],
    transaction_type: [finalValues.transaction_type, Validators.required],
    property_type: [finalValues.property_type, Validators.required],
    price: [finalValues.price, [Validators.required, Validators.min(0)]],
    is_occupied: [finalValues.is_occupied],
    is_furnished: [finalValues.is_furnished],
    construction_m2: [finalValues.construction_m2],
    land_m2: [finalValues.land_m2],
    garden_m2: [finalValues.garden_m2],
    floors: [finalValues.floors],
    bedrooms: [finalValues.bedrooms],
    bathrooms: [finalValues.bathrooms],
    garage_size: [finalValues.garage_size],
    amenities: [finalValues.amenities],
    utilities: [finalValues.utilities],
    gas_types: [finalValues.gas_types],
    extras: [finalValues.extras],
    description: [finalValues.description],
    notes: [finalValues.notes],
  });
}
