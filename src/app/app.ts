import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserStateService } from './services/user-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  title = 'DS-Frontend';
  private previousUrl: string = '';

  constructor(
    private router: Router,
    private userStateService: UserStateService
  ) {}

  ngOnInit() {
    // Clear MFA verification only on actual navigation, not on reload
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Only clear MFA if it's an actual navigation (URL changed)
        if (this.previousUrl && this.previousUrl !== event.url) {
          this.userStateService.setMfaVerified(false);
        }
        this.previousUrl = event.url;
      });
  }
}
