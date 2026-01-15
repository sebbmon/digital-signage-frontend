import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MediaResponse } from './media.service';

export interface PlaylistFile extends MediaResponse {
  filePlayTime?: number | null;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  files: PlaylistFile[]; 
  devices?: any[];
}

export interface PlaylistFileRequest {
  id: string;
  filePlayTime?: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private apiUrl = '/playlists';

  constructor(private http: HttpClient) {}

  getPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(this.apiUrl);
  }

  addPlaylist(name: string, description: string, playlistFiles: PlaylistFileRequest[]): Observable<Playlist> {
    const body = { name, description, deviceIds: [], playlistFiles };
    return this.http.post<Playlist>(this.apiUrl, body);
  }

  deletePlaylist(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updatePlaylist(id: string, name: string, description: string, playlistFiles: PlaylistFileRequest[]): Observable<Playlist> {
    const body = { name, description, deviceIds: [], playlistFiles };
    return this.http.put<Playlist>(`${this.apiUrl}/${id}`, body);
  }
}