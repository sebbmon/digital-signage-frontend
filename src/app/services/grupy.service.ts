import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {GroupEvent} from '../pages/grupy/grupy';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) {}

  getGroups(): Observable<any[]> {
    return this.http.get<any[]>('/groups');
  }

  createGroup(data: any): Observable<any> {
    return this.http.post<any>('/groups', data);
  }

  updateGroup(id: string, data: any): Observable<any> {
    return this.http.put<any>(`/groups/${id}`, data);
  }

  deleteGroup(id: string): Observable<void> {
    return this.http.delete<void>(`/groups/${id}`);
  }

  getWeeklySchedule(groupId: string, startDate: string): Observable<GroupEvent[]> {
    return this.http.get<GroupEvent[]>(`/schedules/weekly/${groupId}?startDate=${startDate}`);
  }

  createSchedule(groupId: string, payload: any): Observable<any> {
    return this.http.post<any>(`/schedules/${groupId}/from-date`, payload);
  }

  updateSchedule(scheduleId: string, payload: any): Observable<any> {
    return this.http.put<any>(`/schedules/${scheduleId}`, payload);
  }

  deleteSchedule(scheduleId: string) {
    return this.http.delete(`/schedules/${scheduleId}`);
  }
}
