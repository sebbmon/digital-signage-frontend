import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MediaService, MediaResponse } from '../../services/media.service';

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './media.html',
  styleUrls: ['./media.css']
})
export class MediaComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef;

  mediaList: MediaResponse[] = [];

  newMedia = {
    originalName: '',
    file: null as File | null
  };

  isUploading = false;
  uploadError = '';

  //zmienne do custom alerta usuwania
  showDeleteModal = false;
  mediaIdToDelete: string | null = null;
  isDeleting = false;

  constructor(private mediaService: MediaService) {}

  ngOnInit() {
    this.loadMedia();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.newMedia.file = input.files[0];
    }
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  uploadMedia() {
    if (!this.newMedia.file || !this.newMedia.originalName) {
      this.uploadError = 'Uzupełnij nazwę i wybierz plik.';
      return;
    }

    this.isUploading = true;
    this.uploadError = '';

    this.mediaService.uploadFile(this.newMedia.file, this.newMedia.originalName)
      .subscribe({
        next: (response) => {
          this.mediaList.unshift(response);
          
          this.newMedia = { originalName: '', file: null };
          
          if (this.fileInputRef) {
            this.fileInputRef.nativeElement.value = ''; 
          }

          this.isUploading = false;
        },
        error: (err) => {
          this.uploadError = 'Błąd podczas przesyłania pliku.';
          this.isUploading = false;
          console.error(err);
        }
      });
  }

  loadMedia() {
    this.mediaService.getAllMedia().subscribe({
      next: (data) => {
        this.mediaList = data.sort((a: any, b: any) => 
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
      },
      error: (err) => console.error('Błąd podczas ładowania mediów:', err),
    });
  }

  deleteMedia(id: string) {
    if (!confirm('Czy na pewno chcesz usunąć ten plik?')) return;

    this.mediaService.deleteMedia(id).subscribe({
      next: () => (this.mediaList = this.mediaList.filter(m => m.id !== id)),
      error: (err) => console.error('Błąd podczas usuwania pliku:', err),
    });
  }

  openDeleteModal(id: string) {
    this.mediaIdToDelete = id;
    this.showDeleteModal = true;
    document.body.style.overflow = 'hidden';
  }

  confirmDelete() {
    if (!this.mediaIdToDelete) return;

    this.isDeleting = true;

    this.mediaService.deleteMedia(this.mediaIdToDelete).subscribe({
      next: () => {
        this.mediaList = this.mediaList.filter(m => m.id !== this.mediaIdToDelete);
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Błąd podczas usuwania pliku:', err);
        alert('Nie udało się usunąć pliku.');
        this.isDeleting = false;
      }
    });
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.mediaIdToDelete = null;
    this.isDeleting = false;
    document.body.style.overflow = '';
  }

  // podglad
  selectedMedia: MediaResponse | null = null;
  selectedMediaUrl: string | null = null;
  showPreview = false;
  videoLoaded = false;
  imageLoaded = false;

  previewMedia(media: MediaResponse) {
    this.selectedMedia = media;
    this.showPreview = true;
    document.body.style.overflow = 'hidden';

    if (media.contentType.startsWith('video')) {
      this.videoLoaded = false;
      this.mediaService.downloadFile(media.id).subscribe({
        next: (blob) => {
          if (this.selectedMediaUrl) {
            URL.revokeObjectURL(this.selectedMediaUrl);
          }
          this.selectedMediaUrl = URL.createObjectURL(new Blob([blob], { type: media.contentType }));
          setTimeout(() => this.videoLoaded = true, 50);
        },
        error: (err) => console.error('Błąd podczas pobierania wideo:', err)
      });
    } else if (media.contentType.startsWith('image')) {
      this.imageLoaded = false;
      this.selectedMediaUrl = null;

      this.mediaService.downloadFile(media.id).subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(new Blob([blob], { type: media.contentType }));
          this.selectedMediaUrl = url;
        },
        error: (err) => console.error('Błąd podczas pobierania obrazu:', err)
      });
    }
  }

  closePreview() {
    if (this.selectedMediaUrl) {
      URL.revokeObjectURL(this.selectedMediaUrl);
      this.selectedMediaUrl = null;
    }
    this.selectedMedia = null;
    this.showPreview = false;
    this.videoLoaded = false;
    this.imageLoaded = false;
    document.body.style.overflow = '';
  }

  // pobieranie
  downloadMedia(media: MediaResponse) {
    this.mediaService.downloadFile(media.id).subscribe((blob) => {
      const typedBlob = new Blob([blob], { type: media.contentType });

      const url = window.URL.createObjectURL(typedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = media.originalName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
