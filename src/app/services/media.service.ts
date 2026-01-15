import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MediaResponse {
  id: string;
  filename: string;
  originalName: string;
  contentType: 'image' | 'video';
  size: number;
  path: string;
  uploadedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private apiUrl = '/files';
  
  constructor(private http: HttpClient) {}

  uploadFile(file: File, originalName: string): Observable<MediaResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', originalName);

    return this.http.post<MediaResponse>(`${this.apiUrl}/upload`, formData, {headers: {"is-file": "true"}});
  }

  getAllMedia(): Observable<MediaResponse[]> {
    return this.http.get<MediaResponse[]>(this.apiUrl);
  }

  deleteMedia(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  downloadFile(id: string) {
    return this.http.get(`/files/${id}/download`, {
      responseType: 'blob'
    });
  }
}
