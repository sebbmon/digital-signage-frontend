import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Agent {
  id?: string;
  name: string;
  description: string;
  model: string;
  ipAddress: string;
  port: number;
  verificationCode?: string;
  lastSeen?: string | null;
  isActive?: boolean;
  isOnline: boolean;

  groupId?: string;
  groupName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AgenciService {
  private apiUrl = '/devices';

  constructor(private http: HttpClient) {}

  getAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(this.apiUrl);
  }

  addAgent(agent: Agent): Observable<Agent> {
    return this.http.post<Agent>(this.apiUrl, agent);
  }

  updateAgent(agent: Agent): Observable<Agent> {
    return this.http.put<Agent>(`${this.apiUrl}/${agent.id}`, agent);
  }

  deleteAgent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
