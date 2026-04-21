import { Injectable, signal } from '@angular/core';

export interface ErrorModalState {
  isOpen: boolean;
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorModalService {
  private readonly initialState: ErrorModalState = {
    isOpen: false,
    title: '',
    message: ''
  };

  readonly state = signal<ErrorModalState>(this.initialState);

  show(message: string, title = 'Aviso'): void {
    this.state.set({
      isOpen: true,
      title,
      message
    });
  }

  showError(message: string): void {
    this.show(message, 'Error');
  }

  close(): void {
    this.state.set(this.initialState);
  }
}
