import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService, DashboardCounts } from '../../services/dashboard.service';
import { PlaylistService, Playlist } from '../../services/playlisty.service';
import { AgenciService, Agent } from '../../services/agenci.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  
  counts: DashboardCounts = { media: 0, playlisty: 0, agenci: 0, grupy: 0 };
  
  recentPlaylists: Playlist[] = [];
  dashboardAgents: Agent[] = [];

  constructor(
    private dashboardService: DashboardService,
    private playlistService: PlaylistService,
    private agenciService: AgenciService
  ) {}

  ngOnInit() {
    this.dashboardService.counts$.subscribe(counts => this.counts = counts);
    this.dashboardService.refreshCounts();

    this.loadRecentPlaylists();
    this.loadTopAgents();
  }

  loadRecentPlaylists() {
    this.playlistService.getPlaylists().subscribe({
      next: (data) => {

        this.recentPlaylists = data.slice(-4).reverse();
      },
      error: (err) => console.error('Błąd playlist:', err)
    });
  }

  loadTopAgents() {
    this.agenciService.getAgents().subscribe({
      next: (data) => {
        const sortedAgents = data.sort((a, b) => {
           const statusA = a.isActive ? 1 : 0;
           const statusB = b.isActive ? 1 : 0;
           return statusB - statusA;
        });

        this.dashboardAgents = sortedAgents.slice(0, 5);
      },
      error: (err) => console.error('Błąd agentów:', err)
    });
  }
}