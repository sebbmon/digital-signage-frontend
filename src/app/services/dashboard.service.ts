import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { MediaService } from './media.service';
import { PlaylistService } from './playlisty.service';
import { AgenciService } from './agenci.service';
import { GroupService } from './grupy.service';

export interface DashboardCounts {
  media: number;
  playlisty: number;
  agenci: number;
  grupy: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private countsSubject = new BehaviorSubject<DashboardCounts>({
    media: 0,
    playlisty: 0,
    agenci: 0,
    grupy: 0
  });

  counts$ = this.countsSubject.asObservable();

  constructor(
    private mediaService: MediaService,
    private playlistService: PlaylistService,
    private agenciService: AgenciService,
    private groupService: GroupService
  ) {}

  refreshCounts() {
    forkJoin({
      media: this.mediaService.getAllMedia(),
      playlisty: this.playlistService.getPlaylists(),
      agenci: this.agenciService.getAgents(),
      grupy: this.groupService.getGroups()
    }).subscribe({
      next: ({ media, playlisty, agenci, grupy }) => {
        this.countsSubject.next({
          media: media.length,
          playlisty: playlisty.length,
          agenci: agenci.length,
          grupy: grupy.length
        });
      },
      error: (err) => console.error('Błąd pobierania liczników dashboardu', err)
    });
  }
}
