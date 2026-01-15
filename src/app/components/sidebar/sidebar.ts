import { Component, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  constructor(private sidebarService: SidebarService) {}

  sidebarClasses = computed(() => ({
    sidebar: true,
    collapsed: this.sidebarService.isCollapsed()
  }));

  isCollapsed = () => this.sidebarService.isCollapsed();

  toggle() {
    this.sidebarService.toggle();
  }
}
