import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { SidebarComponent } from './components/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SidebarComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  isLoggedIn = false;
  loginData = { username: '', password: '' };
  loginError = '';

  private sub: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    this.sub = this.authService.isLoggedIn$.subscribe(value => {
      this.isLoggedIn = value;
    });
  }

  login() {
    this.authService.login(this.loginData.username, this.loginData.password).subscribe(res => {
      if (res.token) {
        this.loginError = '';

        setTimeout(() => {
          this.router.navigate(['/login-init']);
        }, 50);
        
      } else {
        this.loginError = 'Niepoprawny login lub hasło.';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}