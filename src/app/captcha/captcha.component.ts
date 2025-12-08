import { Component, EventEmitter, Output, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var turnstile: any;

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.css']
})
export class CaptchaComponent implements AfterViewInit, OnDestroy {

  @Output() tokenGenerated = new EventEmitter<string>();
  private retryCount = 0;
  private maxRetries = 50; // 5 seconds max wait time
  private timeoutId: any;

  ngAfterViewInit() {
    this.renderTurnstile();
  }

  renderTurnstile() {
    if (typeof turnstile !== 'undefined') {
      try {
        turnstile.render('#captcha-container', {
          sitekey: '0x4AAAAAACEE0Iz6Tn3ZFxPO',
          callback: (token: string) => {
            console.log('Turnstile token generated');
            this.tokenGenerated.emit(token);
          },
          'error-callback': () => {
            console.error('Turnstile error occurred');
          }
        });
      } catch (error) {
        console.error('Error rendering Turnstile:', error);
      }
    } else {
      this.retryCount++;
      if (this.retryCount < this.maxRetries) {
        this.timeoutId = setTimeout(() => this.renderTurnstile(), 100);
      } else {
        console.error('Turnstile script failed to load after maximum retries');
      }
    }
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
