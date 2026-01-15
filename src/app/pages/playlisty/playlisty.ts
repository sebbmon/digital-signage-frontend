import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MediaService, MediaResponse } from '../../services/media.service';
import { PlaylistService, Playlist, PlaylistFileRequest } from '../../services/playlisty.service';

@Component({
  selector: 'app-playlisty',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './playlisty.html',
  styleUrls: ['./playlisty.css'],
})
export class PlaylistyComponent implements OnInit {

  mediaList: MediaResponse[] = [];
  playlists: Playlist[] = [];
  
  selectedMediaMap: Map<string, number | null> = new Map();

  playlistName: string = '';
  playlistDesc: string = '';
  
  selectedMedia: MediaResponse | null = null;
  selectedMediaUrl: string | null = null;
  showPreview = false;
  videoLoaded = false;
  imageLoaded = false;

  isAdding = false;
  addError = '';

  editPlaylistData: {
    id: string | null;
    name: string;
    description: string;
  } = { id: null, name: '', description: '' };

  editMediaMap: Map<string, number | null> = new Map();

  showEditModal = false;
  editError = '';
  isSavingEdit = false;

  popover = {
    visible: false,
    x: 0,
    y: 0,
    media: null as MediaResponse | null,
    url: null as string | null,
    isLoading: false
  };

  showDeleteModal = false;
  playlistIdToDelete: string | null = null;
  isDeleting = false;

  constructor(private mediaService: MediaService, private playlistService: PlaylistService) {}

  ngOnInit(): void {
    this.loadMedia();
    this.loadPlaylists();
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.popover.visible) {
      const target = event.target as HTMLElement;
      if (target.closest('.media-popover')) {
        return;
      }
      this.closePopover();
    }
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  loadMedia() {
    this.mediaService.getAllMedia().subscribe({
      next: data => {
        this.mediaList = data.sort((a: any, b: any) => 
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
      },
      error: err => console.error('Błąd ładowania mediów:', err)
    });
  }

  loadPlaylists() {
    this.playlistService.getPlaylists().subscribe({
      next: data => this.playlists = data,
      error: err => console.error('Błąd pobierania playlist:', err)
    });
  }

  isMediaSelected(id: string): boolean {
    return this.selectedMediaMap.has(id);
  }

  toggleMediaSelection(id: string) {
    if (this.selectedMediaMap.has(id)) {
      this.selectedMediaMap.delete(id);
    } else {
      this.selectedMediaMap.set(id, null);
    }
  }

  getMediaDuration(id: string): number | null {
    return this.selectedMediaMap.get(id) || null;
  }

  updateMediaDuration(id: string, duration: number | null) {
    if (this.selectedMediaMap.has(id)) {
      this.selectedMediaMap.set(id, duration);
    }
  }

  addPlaylist() {
    if (!this.playlistName) {
      this.addError = 'Podaj nazwę playlisty';
      return;
    }
    if (this.selectedMediaMap.size === 0) {
      this.addError = 'Wybierz przynajmniej jedno medium';
      return;
    }

    this.isAdding = true;
    this.addError = '';

    const playlistFiles: PlaylistFileRequest[] = Array.from(this.selectedMediaMap.entries()).map(([id, time]) => ({
      id: id,
      filePlayTime: time
    }));

    this.playlistService.addPlaylist(this.playlistName, this.playlistDesc, playlistFiles)
      .subscribe({
        next: newPlaylist => {
          this.playlists.push(newPlaylist);
          this.playlistName = '';
          this.playlistDesc = '';
          this.selectedMediaMap.clear();
          this.isAdding = false;
        },
        error: err => {
          console.error('Błąd dodawania playlisty:', err);
          this.addError = 'Błąd podczas dodawania playlisty';
          this.isAdding = false;
        }
      });
  }

  openEditModal(playlist: Playlist) {
    this.editPlaylistData = {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description
    };

    this.editMediaMap.clear();
    playlist.files.forEach(f => {
      this.editMediaMap.set(f.id, f.filePlayTime || null);
    });

    this.showEditModal = true;
    this.editError = '';
    document.body.style.overflow = 'hidden';
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editPlaylistData = { id: null, name: '', description: '' };
    this.editMediaMap.clear();
    this.editError = '';
    document.body.style.overflow = '';
    this.closePopover();
  }

  isEditMediaSelected(id: string): boolean {
    return this.editMediaMap.has(id);
  }

  toggleEditMediaSelection(id: string) {
    if (this.editMediaMap.has(id)) {
      this.editMediaMap.delete(id);
    } else {
      this.editMediaMap.set(id, null);
    }
  }

  getEditMediaDuration(id: string): number | null {
    return this.editMediaMap.get(id) || null;
  }

  updateEditMediaDuration(id: string, duration: number | null) {
    if (this.editMediaMap.has(id)) {
      this.editMediaMap.set(id, duration);
    }
  }

  saveEditPlaylist() {
    if (!this.editPlaylistData.name) {
      this.editError = 'Podaj nazwę playlisty';
      return;
    }
    if (this.editMediaMap.size === 0) {
      this.editError = 'Playlista musi zawierać przynajmniej jedno medium';
      return;
    }
    if (!this.editPlaylistData.id) return;

    this.isSavingEdit = true;

    const playlistFiles: PlaylistFileRequest[] = Array.from(this.editMediaMap.entries()).map(([id, time]) => ({
      id: id,
      filePlayTime: time
    }));

    this.playlistService.updatePlaylist(
      this.editPlaylistData.id,
      this.editPlaylistData.name,
      this.editPlaylistData.description,
      playlistFiles
    ).subscribe({
      next: updatedPlaylist => {
        const index = this.playlists.findIndex(p => p.id === updatedPlaylist.id);
        if (index > -1) this.playlists[index] = updatedPlaylist;
        this.closeEditModal();
        this.isSavingEdit = false;
      },
      error: err => {
        console.error('Błąd aktualizacji playlisty:', err);
        this.editError = 'Błąd podczas zapisywania playlisty';
        this.isSavingEdit = false;
      }
    });
  }

  deletePlaylist(id: string) {
    if (!confirm('Czy na pewno chcesz usunąć playlistę?')) return;
    this.playlistService.deletePlaylist(id).subscribe({
      next: () => this.playlists = this.playlists.filter(p => p.id !== id),
      error: err => console.error('Błąd usuwania playlisty:', err)
    });
  }

  openDeleteModal(id: string) {
    this.playlistIdToDelete = id;
    this.showDeleteModal = true;
    document.body.style.overflow = 'hidden';
  }

  confirmDelete() {
    if (!this.playlistIdToDelete) return;
    this.isDeleting = true;
    this.playlistService.deletePlaylist(this.playlistIdToDelete).subscribe({
      next: () => {
        this.playlists = this.playlists.filter(p => p.id !== this.playlistIdToDelete);
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Błąd usuwania playlisty:', err);
        alert('Nie udało się usunąć playlisty.');
        this.isDeleting = false;
      }
    });
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.playlistIdToDelete = null;
    this.isDeleting = false;
    document.body.style.overflow = '';
  }

  previewMedia(media: MediaResponse) {
    this.selectedMedia = media;
    this.showPreview = true;
    document.body.style.overflow = 'hidden';
    this.loadMediaContent(media, (url) => this.selectedMediaUrl = url);
  }

  closePreview() {
    if (this.selectedMediaUrl) { URL.revokeObjectURL(this.selectedMediaUrl); this.selectedMediaUrl = null; }
    this.selectedMedia = null;
    this.showPreview = false;
    this.videoLoaded = false;
    this.imageLoaded = false;
    document.body.style.overflow = '';
  }

  openPopover(event: MouseEvent, media: MediaResponse) {
    event.stopPropagation();
    let x = event.clientX + 15;
    let y = event.clientY + 10;

    if (x + 320 > window.innerWidth) x = event.clientX - 335;
    if (y + 300 > window.innerHeight) y = window.innerHeight - 310;

    this.popover = {
      visible: true,
      x: x,
      y: y,
      media: media,
      url: null,
      isLoading: true
    };

    this.loadMediaContent(media, (url) => {
      if (this.popover.visible && this.popover.media?.id === media.id) {
        this.popover.url = url;
        this.popover.isLoading = false;
      }
    });
  }

  closePopover() {
    if (this.popover.url) { URL.revokeObjectURL(this.popover.url); }
    this.popover.visible = false;
    this.popover.url = null;
    this.popover.media = null;
  }

  private loadMediaContent(media: MediaResponse, callback: (url: string) => void) {
    this.mediaService.downloadFile(media.id).subscribe({
      next: blob => {
        const url = URL.createObjectURL(new Blob([blob], { type: media.contentType }));
        callback(url);
      },
      error: err => console.error('Błąd pobierania pliku:', err)
    });
  }
}