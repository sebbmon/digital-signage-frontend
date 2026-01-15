import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { Router, ActivatedRoute, NavigationEnd, Data } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter, map, mergeMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  pageTitle = 'Dashboard';

  // logowanie
  isLoggedIn = false;
  showLoginModal = false;

  userName = '';
  userRole = '';
  userAvatar = '';

  loginData = { username: '', password: '' };

  currentDateTime = '';

  constructor(
    private sidebarService: SidebarService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap(route => route.data)
      )
      .subscribe((data: Data) => {
        this.pageTitle = data['title'] || 'Dashboard';
      });

    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userName = 'test@test.pl';
      this.userRole = 'Administrator';
    }
  }
  
  ngOnInit(): void {
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
  }

  updateDateTime() {
    const now = new Date();

    const dni = ['ndz.', 'pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.'];
    const miesiace = [
      'sty', 'lut', 'mar', 'kwi', 'maj', 'cze',
      'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'
    ];

    const godz = now.getHours().toString().padStart(2, '0');
    const min = now.getMinutes().toString().padStart(2, '0');

    this.currentDateTime = `${godz}:${min} • ${dni[now.getDay()]}, ${now.getDate()} ${miesiace[now.getMonth()]}`;
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  login() {
    this.authService.login(this.loginData.username, this.loginData.password).subscribe(res => {
      if (res.token) {
        this.isLoggedIn = true;
        this.userName = this.loginData.username;
        this.userRole = 'Administrator';
        this.showLoginModal = false;
        this.loginData = { username: '', password: '' };
      } else {
        alert('Błąd logowania!');
      }
    });
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userName = '';
    this.userRole = '';
    this.userAvatar = '';
  }
}
