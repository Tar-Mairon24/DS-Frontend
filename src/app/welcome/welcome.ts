import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="welcome-container">
      <div class="welcome-card">
        <h1>¡Login correcto!</h1>
        <h2>Bienvenido</h2>
        <div class="success-icon">✓</div>
        <button routerLink="/login" class="btn">Volver al login</button>
      </div>
    </div>
  `,
  styles: [`
    .welcome-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .welcome-card {
      background: white;
      padding: 3rem;
      border-radius: 15px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      text-align: center;
      max-width: 400px;
      width: 90%;
    }

    .btn {
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s ease;
      margin-top: 2rem;
    }

    .btn:hover {
      background-color: #45a049;
    }

    h1 {
      color: #4CAF50;
      font-size: 2.5rem;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    h2 {
      color: #333;
      font-size: 2rem;
      margin-bottom: 2rem;
      font-weight: 400;
    }

    .success-icon {
      font-size: 4rem;
      color: #4CAF50;
      background: #E8F5E8;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }
  `]
})
export class WelcomeComponent {
  constructor() { }
}
