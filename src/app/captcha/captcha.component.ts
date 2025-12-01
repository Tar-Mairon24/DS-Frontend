import { Component, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var turnstile: any;

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.css']
})
export class CaptchaComponent implements AfterViewInit {

  @Output() tokenGenerated = new EventEmitter<string>();

  ngAfterViewInit() {
    // Renderizar Turnstile en el div con id "captcha-container"
    turnstile.render('#captcha-container', {
      sitekey: '0x4AAAAAACEE0Iz6Tn3ZFxPO', // SITE KEY real
      callback: (token: string) => {
        this.tokenGenerated.emit(token);
      }
    });
  }
}
