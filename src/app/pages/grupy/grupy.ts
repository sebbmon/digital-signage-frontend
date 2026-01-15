import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../services/grupy.service';
import { AgenciService } from '../../services/agenci.service';
import { PlaylistService, Playlist } from '../../services/playlisty.service';
import { CalendarOptions, EventInput, DateSelectArg, EventClickArg, EventDropArg} from '@fullcalendar/core';
import { EventResizeDoneArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import plLocale from '@fullcalendar/core/locales/pl';

export interface GroupEvent {
  id: string,
  playlistId: string,
  startDate: Date,
  startTime: string,
  endTime: string,
  timeZone: string
}

@Component({
  selector: 'app-grupy',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './grupy.html',
  styleUrls: ['./grupy.css']
})
export class GrupyComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  @ViewChild('eventPopover') eventPopoverRef!: ElementRef;

  groups: any[] = [];
  activeGroup: any = null;

  showAddModal = false;
  showEditModal = false;

  showEventModal = false;
  isEditMode = false;
  currentEventId: string | null = null;
  popupPosition = { top: 0, left: 0 };

  eventForm: {
    playlistId?: string;
    startDate?: string;
    startTime?: string;
    endTime?: string;
    custom?: boolean;
  } = {};

  availablePlaylists: Playlist[] = [];

  formErrors: { name?: string; devices?: string } = {};
  newGroup: any = { name: '', description: '', location: '' };

  availableDevices: any[] = [];
  selectedDeviceIds: Set<string> = new Set();
  deviceSearchTerm: string = '';

  groupEvents: { [key: string]: EventInput[] } = {};
  calendarCurrentDate: Date = new Date();

  // zmienne do modala usuwania
  showDeleteModal = false;
  isDeleting = false;
  
  deleteActionType: 'GROUP' | 'EVENT' | null = null; 
  
  deleteModalTitle = '';
  deleteModalMessage = '';

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    firstDay: 1,
    dayHeaderFormat: { weekday: 'long' },
    slotMinTime: '00:00:00',
    slotMaxTime: '24:00:00',
    allDaySlot: false,
    editable: true,
    selectable: true,
    selectMirror: true,
    contentHeight: 700,
    aspectRatio: 1.4,
    unselectCancel: '.event-popover',
    locale: plLocale,
    slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
    eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
    datesSet: this.handleDatesSet.bind(this),
    
    customButtons: {
      prev: {
        text: '<',
        click: () => this.calendarComponent.getApi().prev()
      },
      next: {
        text: '>',
        click: () => this.calendarComponent.getApi().next()
      },
      myToday: {
        text: 'Dziś',
        click: () => this.calendarComponent.getApi().today()
      }
    },
    headerToolbar: { left: 'prev,next myToday', center: 'title', right: 'timeGridWeek,dayGridMonth' },
    events: []
  };

  constructor(
    private groupService: GroupService,
    private agenciService: AgenciService,
    private playlistService: PlaylistService
  ) {}

  ngOnInit() {
    this.loadGroups();
    this.loadDevices();

    this.calendarOptions.select = this.handleDateSelect.bind(this);
    this.calendarOptions.eventClick = this.handleEventClick.bind(this);

    this.calendarOptions.eventDrop = this.handleEventDrop.bind(this);
    this.calendarOptions.eventResize = this.handleEventResize.bind(this);
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.showDeleteModal) {
      return;
    }

    if (this.showEventModal) {
      if (this.eventPopoverRef && this.eventPopoverRef.nativeElement.contains(event.target)) {
        return;
      }
      this.closeEventModal();
    }
  }

  // przesuwania upuszczanie resize
  handleEventDrop(changeInfo: EventDropArg) {
    this.processEventChange(changeInfo);
  }

  handleEventResize(changeInfo: EventResizeDoneArg) {
    this.processEventChange(changeInfo);
  }

  private processEventChange(changeInfo: EventDropArg | EventResizeDoneArg) {
    if (!this.activeGroup) return;

    const event = changeInfo.event;
    const eventId = event.id;

    const newStartDate = event.startStr.split('T')[0];
    const newStartTime = event.startStr.split('T')[1].substring(0, 5);
    const newEndTime = event.endStr?.split('T')[1]?.substring(0, 5) || '00:00';

    const payload = {
      playlistId: event.extendedProps['playlistId'],
      startDate: newStartDate,
      startTime: newStartTime,
      endTime: newEndTime,
      custom: event.extendedProps['custom'],
      timeZone: 'Europe/Warsaw'
    };

    // put
    this.groupService.updateSchedule(eventId, payload).subscribe({
      next: () => {
      },
      error: (err) => {
        console.error('Błąd aktualizacji (Drag&Drop)', err);
        alert('Nie udało się przenieść wydarzenia.');
        changeInfo.revert();
      }
    });
  }

  loadGroups() {
    this.groupService.getGroups().subscribe({
      next: (res) => {
        this.groups = res || [];
        this.groups.forEach(g => { if (!this.groupEvents[g.id]) this.groupEvents[g.id] = []; });

        if (this.groups.length > 0 && !this.activeGroup) this.selectGroup(this.groups[0]);
        else if (this.activeGroup) {
          const refreshed = this.groups.find(g => g.id === this.activeGroup.id);
          if (refreshed) this.activeGroup = refreshed;
        }
      },
      error: (err) => console.error('Błąd pobierania grup', err)
    });
  }

  selectGroup(group: any) {
    this.activeGroup = group;
    this.closeEventModal();
    this.loadEventsForGroup(group.id);
  }

  loadDevices() {
    this.agenciService.getAgents().subscribe({
      next: (res) => this.availableDevices = res || [],
      error: (err) => console.error('Błąd pobierania urządzeń', err)
    });
  }

  toggleDeviceSelection(deviceId: string, checked: boolean) {
    if (checked) this.selectedDeviceIds.add(deviceId);
    else this.selectedDeviceIds.delete(deviceId);
    delete this.formErrors.devices;
  }

  isDeviceSelectable(device: any) {
    if (!device) return false;
    if (!device.groupId) return true;
    if (this.showEditModal && this.activeGroup && device.groupId === this.activeGroup.id) return true;
    return false;
  }

  isDeviceSelected(device: any) {
    return this.selectedDeviceIds.has(device.id);
  }

  modalDevicesList() {
    const term = (this.deviceSearchTerm || '').toLowerCase().trim();
    return this.availableDevices
      .filter(d => this.isDeviceSelectable(d))
      .filter(d => !term || d.name.toLowerCase().includes(term) || (d.ipAddress || '').includes(term));
  }

  // logika kalendara
  loadEventsForGroup(groupId: string) {
    if (!groupId) return;
    const startOfWeek = this.calendarCurrentDate;
    const year = startOfWeek.getFullYear();
    const month = String(startOfWeek.getMonth() + 1).padStart(2, '0');
    const day = String(startOfWeek.getDate()).padStart(2, '0');
    const startDate = `${year}-${month}-${day}`;

    this.groupService.getWeeklySchedule(groupId, startDate).subscribe({
      next: (res) => {
        this.groupEvents[groupId] = res.map((s: any) => ({
          id: s.id,
          title: s.playlistName,
          start: `${s.startDate}T${s.startTime}`,
          end: `${s.startDate}T${s.endTime}`,
          backgroundColor: s.custom ? '#6c757d' : `rgb(${(s.playlistName.length*50)%255},${(s.playlistName.length*60)%255},${(s.playlistName.length*70)%255})`,
          extendedProps: {
            playlistId: s.playlistId,
            timeZone: s.timeZone,
            custom: s.custom
          }
        }));
        this.calendarOptions = { ...this.calendarOptions, events: this.groupEvents[groupId] };
      },
      error: (err) => console.error('Błąd pobierania harmonogramu', err)
    });
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    if (!this.activeGroup) return;

    this.isEditMode = false;
    this.currentEventId = null;

    this.eventForm = {
      startDate: selectInfo.startStr.split('T')[0],
      startTime: selectInfo.startStr.split('T')[1].substring(0,5),
      endTime: selectInfo.endStr.split('T')[1].substring(0,5),
      custom: false
    };

    this.setupPopoverPosition(selectInfo.jsEvent);
    this.loadPlaylistsAndShow();
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (!this.activeGroup) return;

    clickInfo.jsEvent.preventDefault();

    this.isEditMode = true;
    const event = clickInfo.event;
    this.currentEventId = event.id;

    this.eventForm = {
      playlistId: event.extendedProps['playlistId'],
      startDate: event.startStr.split('T')[0],
      startTime: event.startStr.split('T')[1]?.substring(0,5) || '00:00',
      endTime: event.endStr?.split('T')[1]?.substring(0,5) || '00:00',
      custom: event.extendedProps['custom']
    };

    this.setupPopoverPosition(clickInfo.jsEvent);
    this.loadPlaylistsAndShow();
  }

  private setupPopoverPosition(jsEvent: MouseEvent | null) {
    if (jsEvent) {
      let top = jsEvent.clientY;
      let left = jsEvent.clientX;

      const popoverWidth = 320;
      const popoverHeight = 400;

      if (left + popoverWidth > window.innerWidth) {
        left = window.innerWidth - popoverWidth - 20;
      }

      if (top + popoverHeight > window.innerHeight) {
        top = window.innerHeight - popoverHeight - 20;
      }

      this.popupPosition = { top, left };
    } else {
      this.popupPosition = {
        top: window.innerHeight / 2 - 200,
        left: window.innerWidth / 2 - 160
      };
    }
  }

  private loadPlaylistsAndShow() {
    this.playlistService.getPlaylists().subscribe({
      next: (res) => {
        this.availablePlaylists = res || [];
        this.showEventModal = true;
      },
      error: (err) => {
        console.error('Błąd pobierania playlist', err);
        this.showEventModal = true;
      }
    });
  }

  handleSave() {
    if (!this.activeGroup || !this.eventForm.playlistId) return;

    const payload = {
      playlistId: this.eventForm.playlistId,
      startDate: this.eventForm.startDate,
      startTime: this.eventForm.startTime,
      endTime: this.eventForm.endTime,
      custom: this.eventForm.custom,
      timeZone: 'Europe/Warsaw'
    };

    if (this.isEditMode && this.currentEventId) {
      this.groupService.updateSchedule(this.currentEventId, payload).subscribe({
        next: () => {
          this.loadEventsForGroup(this.activeGroup.id);
          this.closeEventModal();
        },
        error: (err) => {
          console.error('Błąd edycji (PUT)', err);
          alert('Wystąpił błąd podczas aktualizacji.');
        }
      });
    } else {
      this.groupService.createSchedule(this.activeGroup.id, payload).subscribe({
        next: () => {
          this.loadEventsForGroup(this.activeGroup.id);
          this.closeEventModal();
        },
        error: (err) => console.error('Błąd tworzenia eventu', err)
      });
    }
  }

  // delete z poziomu edycji
  handleDelete() {
    if (!this.currentEventId) return;
    if (!confirm('Czy na pewno chcesz usunąć ten harmonogram?')) return;

    this.groupService.deleteSchedule(this.currentEventId).subscribe({
      next: () => {
        this.loadEventsForGroup(this.activeGroup.id);
        this.closeEventModal();
      },
      error: (err) => {
        console.error('Błąd usuwania', err);
        alert('Nie udało się usunąć eventu.');
      }
    });
  }

  closeEventModal() {
    this.showEventModal = false;
    this.isEditMode = false;
    this.currentEventId = null;

    if (this.calendarComponent) {
      this.calendarComponent.getApi().unselect();
    }
  }

  // modale do grup
  openAddGroupModal() {
    this.newGroup = { name: '', description: '', location: '' };
    this.selectedDeviceIds.clear();
    this.deviceSearchTerm = '';
    this.formErrors = {};
    document.body.style.overflow = 'hidden';
    this.showAddModal = true;
  }

  openEditGroupModal() {
    if (!this.activeGroup) return;
    this.newGroup = { ...this.activeGroup };
    this.selectedDeviceIds.clear();
    (this.activeGroup.devices || []).forEach((d: any) => d?.id && this.selectedDeviceIds.add(d.id));
    this.deviceSearchTerm = '';
    this.showEditModal = true;
    document.body.style.overflow = 'hidden';
    this.formErrors = {};
  }

  saveNewGroup() {
    this.formErrors = {};
    if (!this.newGroup.name?.trim()) { this.formErrors.name = 'Nazwa grupy nie może być pusta'; return; }
    //if (this.selectedDeviceIds.size === 0) { this.formErrors.devices = 'Grupa musi zawierać przynajmniej 1 urządzenie'; return; }

    const payload: any = { name: this.newGroup.name.trim(), devices: Array.from(this.selectedDeviceIds) };
    if (this.newGroup.location) payload.location = this.newGroup.location;
    if (this.newGroup.description) payload.description = this.newGroup.description;

    this.groupService.createGroup(payload).subscribe({
      next: (group) => {
        this.loadGroups();
        this.loadDevices();
        this.showAddModal = false;
        this.selectedDeviceIds.clear();
        this.selectGroup(group);
      },
      error: (err) => console.error('Błąd tworzenia grupy', err)
    });
  }

  saveEditedGroup() {
    if (!this.activeGroup) return;
    this.formErrors = {};
    if (!this.newGroup.name?.trim()) { this.formErrors.name = 'Nazwa grupy nie może być pusta'; return; }
    //if (this.selectedDeviceIds.size === 0) { this.formErrors.devices = 'Grupa musi zawierać przynajmniej 1 urządzenie'; return; }

    const payload: any = { name: this.newGroup.name, devices: Array.from(this.selectedDeviceIds) };
    if (this.newGroup.location) payload.location = this.newGroup.location;
    if (this.newGroup.description) payload.description = this.newGroup.description;

    this.groupService.updateGroup(this.activeGroup.id, payload).subscribe({
      next: () => {
        this.loadGroups();
        this.loadDevices();
        this.showEditModal = false;
        this.selectedDeviceIds.clear();
      },
      error: (err) => console.error('Błąd edycji grupy', err)
    });
  }

  closeModal() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.formErrors = {};
    document.body.style.overflow = '';
    this.selectedDeviceIds.clear();
  }

  deleteActiveGroup() {
    if (!this.activeGroup || !confirm('Czy na pewno chcesz usunąć grupę?')) return;
    this.groupService.deleteGroup(this.activeGroup.id).subscribe({
      next: () => {
        this.loadGroups();
        this.loadDevices();
        this.activeGroup = null;
        alert('Grupa została usunięta.');
      },
      error: (err) => {
        console.error('Błąd usuwania grupy', err);
        alert('Błąd usuwania grupy');
      }
    });
  }

  handleDatesSet(dateInfo: any) {
    this.calendarCurrentDate = dateInfo.view.currentStart;
    
    if (this.activeGroup) {
      this.loadEventsForGroup(this.activeGroup.id);
    }

    const today = new Date();
    const start = dateInfo.start;
    const end = dateInfo.end;

    const isTodayVisible = today >= start && today < end;

    const todayBtn = document.querySelector('.fc-myToday-button') as HTMLButtonElement;
    
    if (todayBtn) {
      todayBtn.disabled = isTodayVisible;
      
      if (isTodayVisible) {
        todayBtn.style.opacity = '0.6';
        todayBtn.style.cursor = 'default';
      } else {
        todayBtn.style.opacity = '1';
        todayBtn.style.cursor = 'pointer';
      }
    }
  }

  openDeleteGroupModal() {
    if (!this.activeGroup) return;
    
    this.deleteActionType = 'GROUP';
    this.deleteModalTitle = 'Usunąć tę grupę?';
    this.deleteModalMessage = 'Zostanie ona trwale usunięta wraz z przypisaniami urządzeniami. Urządzenia nie zostaną usunięte z systemu, ale trafią do puli "Dostępne".';
    
    this.showDeleteModal = true;
    document.body.style.overflow = 'hidden';
  }

  openDeleteEventModal() {
    if (!this.currentEventId) return;

    this.deleteActionType = 'EVENT';
    this.deleteModalTitle = 'Usunąć harmonogram?';
    this.deleteModalMessage = 'To wydarzenie zostanie usunięte z kalendarza. Tej operacji nie można cofnąć.';

    this.showDeleteModal = true;
    document.body.style.overflow = 'hidden';
  }

  confirmDelete() {
    this.isDeleting = true;

    if (this.deleteActionType === 'GROUP') {
      this.executeGroupDelete();
    } else if (this.deleteActionType === 'EVENT') {
      this.executeEventDelete();
    }
  }

  private executeGroupDelete() {
    if (!this.activeGroup) return;
    
    this.groupService.deleteGroup(this.activeGroup.id).subscribe({
      next: () => {
        this.loadGroups();
        this.loadDevices();
        this.activeGroup = null;
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Błąd usuwania grupy', err);
        alert('Błąd usuwania grupy');
        this.isDeleting = false;
      }
    });
  }

  private executeEventDelete() {
    if (!this.currentEventId) return;

    this.groupService.deleteSchedule(this.currentEventId).subscribe({
      next: () => {
        this.loadEventsForGroup(this.activeGroup.id);
        this.closeEventModal();
        this.closeDeleteModal();
      },
      error: (err) => {
        if (err.status === 404) {
           this.loadEventsForGroup(this.activeGroup.id);
           this.closeEventModal();
           this.closeDeleteModal();
        } else {
           console.error('Błąd usuwania', err);
           alert('Nie udało się usunąć eventu.');
           this.isDeleting = false;
        }
      }
    });
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deleteActionType = null;
    this.isDeleting = false;
    if (!this.showAddModal && !this.showEditModal) {
       document.body.style.overflow = '';
    }
  }

  clearSelectedDevices() { this.selectedDeviceIds.clear(); }
}