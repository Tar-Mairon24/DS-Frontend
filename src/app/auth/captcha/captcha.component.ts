import { Component, EventEmitter, Output, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CAPTCHA_ENABLED, MOCK_CAPTCHA_TOKEN } from '../../shared/utils/config';

declare var turnstile: any;

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.css']
})
export class CaptchaComponent implements AfterViewInit, OnDestroy, OnInit {

  @Output() tokenGenerated = new EventEmitter<string>();
  private retryCount = 0;
  private maxRetries = 100;
  private timeoutId: any;
  private renderAttempts = 0;
  private maxRenderAttempts = 5;

  constructor() {
    console.log('CAPTCHA_ENABLED value:', CAPTCHA_ENABLED);
  }

  ngOnInit() {
    // Ensure container is clean on component creation
    const container = document.getElementById('captcha-container');
    if (container) {
      container.innerHTML = '';
    }
  }

  ngAfterViewInit() {
    if (!CAPTCHA_ENABLED) {
      // Auto-emit mock token when captcha is disabled
      console.log('Captcha disabled - using mock token for testing');
      setTimeout(() => this.tokenGenerated.emit(MOCK_CAPTCHA_TOKEN), 100);
      return;
    }

    // Add a small delay to ensure DOM is fully ready
    setTimeout(() => this.renderTurnstile(), 100);
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
            // Retry on error after a delay
            if (this.renderAttempts < this.maxRenderAttempts) {
              this.renderAttempts++;
              setTimeout(() => this.attemptRerender(), 2000);
            }
          }
        });
      } catch (error) {
        console.error('Error rendering Turnstile:', error);
        // Retry on render exception
        if (this.renderAttempts < this.maxRenderAttempts) {
          this.renderAttempts++;
          setTimeout(() => this.attemptRerender(), 2000);
        }
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

  private attemptRerender() {
    // Clear any existing captcha container and retry
    const container = document.getElementById('captcha-container');
    if (container) {
      container.innerHTML = '';
    }
    this.renderTurnstile();
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}

