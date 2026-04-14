import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserService } from '@services/user.service';
import { User } from '@shared/models/user';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './property-details.component.html',
  styleUrls: ['../section.shared.css'],
})
export class PropertyDetailsComponent implements OnInit, OnDestroy {
  @Input() form!: FormGroup;

  ownerSearch = new FormControl('');
  ownerResults: User[] = [];
  selectedOwner: User | null = null;
  showOwnerDropdown = false;
  isLoadingOwners = false;

  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.ownerSearch.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((q) => {
      if ((q ?? '').length === 0) {
        this.selectedOwner = null;
        this.form.patchValue({ owner_id: null });
        this.ownerResults = [];
        // Reload the 5 defaults
        this.isLoadingOwners = true;
        this.userService
          .getOwners('')
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (owners) => {
              this.ownerResults = owners.slice(0, 5);
              this.isLoadingOwners = false;
            },
            error: () => {
              this.isLoadingOwners = false;
            },
          });
      }
    });

    // If editing an existing property, load the owner name to display
    const existingOwnerId = this.form.get('owner_id')?.value;
    if (existingOwnerId) {
      this.userService
        .getUserById(String(existingOwnerId))
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            const owner = res?.data ?? res;
            this.selectedOwner = owner;
            this.ownerSearch.setValue(owner.username, { emitEvent: false });
          },
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectOwner(owner: User) {
    this.selectedOwner = owner;
    this.form.patchValue({ owner_id: owner.id });
    this.ownerSearch.setValue(owner.username, { emitEvent: false });
    this.showOwnerDropdown = false;
  }

  openOwnerSearch() {
    this.showOwnerDropdown = true;
    if (!this.ownerResults.length) {
      this.isLoadingOwners = true;
      this.userService
        .getOwners('')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (owners) => {
            this.ownerResults = owners.slice(0, 5);
            this.isLoadingOwners = false;
          },
          error: () => {
            this.isLoadingOwners = false;
          },
        });
    }
  }

  closeOwnerDropdown() {
    setTimeout(() => {
      this.showOwnerDropdown = false;
    }, 150);
  }

  createNewOwner() {
    this.showOwnerDropdown = false;
  }

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
      input.value = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numberValue);
    }
  }

  onPriceBlur(): void {
    const priceControl = this.form.get('price');
    if (priceControl?.value) {
      const input = document.querySelector('input[formControlName="price"]') as HTMLInputElement;
      if (input) {
        input.value = new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(priceControl.value);
      }
    }
  }

  onPriceFocus(event: any): void {
    const priceControl = this.form.get('price');
    if (priceControl?.value) event.target.value = priceControl.value.toString();
  }
}
