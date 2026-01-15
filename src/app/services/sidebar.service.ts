// src/app/services/sidebar.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarService {

  private collapsed = signal(false);

  isCollapsed() {
    return this.collapsed();
  }

  toggle() {
    this.collapsed.update(v => !v);
  }

  collapse() {
    this.collapsed.set(true);
  }

  expand() {
    this.collapsed.set(false);
  }
}
