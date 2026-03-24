import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorModalComponent } from '@shared/components/errors/error-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ErrorModalComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'DS-Frontend';
}
