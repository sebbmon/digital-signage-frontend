import { Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard';
import { AgenciComponent } from './pages/agenci/agenci';
import { GrupyComponent } from './pages/grupy/grupy';
import { MediaComponent } from './pages/media/media';
import { PlaylistyComponent } from './pages/playlisty/playlisty';
import { UstawieniaComponent } from './pages/ustawienia/ustawienia';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard], data: { title: 'Dashboard' } },
  { path: 'agenci', component: AgenciComponent, canActivate: [AuthGuard], data: { title: 'Agenci' } },
  { path: 'grupy', component: GrupyComponent, canActivate: [AuthGuard], data: { title: 'Grupy' } },
  { path: 'media', component: MediaComponent, canActivate: [AuthGuard], data: { title: 'Media' } },
  { path: 'playlisty', component: PlaylistyComponent, canActivate: [AuthGuard], data: { title: 'Playlisty' } },
  //ustawienia przyszlosciowo
  //{ path: 'ustawienia', component: UstawieniaComponent, canActivate: [AuthGuard], data: { title: 'Ustawienia' } },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

