import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgenciService, Agent } from '../../services/agenci.service';
import { GroupService } from '../../services/grupy.service';

@Component({
  selector: 'app-agenci',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenci.html',
  styleUrls: ['./agenci.css'],
})
export class AgenciComponent implements OnInit {

  agents: Agent[] = [];

  // modale
  showAddModal = false;
  addError = '';
  isSavingAdd = false;

  newAgent: Partial<Agent> & { verificationCode?: string } = {
    name: '',
    description: '',
    model: '',
    ipAddress: '',
    port: 9000,
    groupId: '',
    verificationCode: ''
  };

  showEditModal = false;
  editError = '';
  isSavingEdit = false;
  editAgentData: Partial<Agent> = {};

  // do filtrow
  searchTerm: string = '';
  sortOption: string = '';
  selectedGroupFilter: string = '';

  // do grup
  groups: any[] = [];

  // do obsługi modala usuwania
  showDeleteModal = false;
  agentIdToDelete: string | null = null;
  isDeleting = false;

  constructor(private agenciService: AgenciService,
              private groupService: GroupService) {}

  ngOnInit() {
    this.loadAgents();
    this.loadGroups();
  }

  loadAgents() {
    this.agenciService.getAgents().subscribe({
      next: data => this.agents = data,
      error: err => console.error('Błąd pobierania agentów:', err)
    });
  }

  loadGroups() {
    this.groupService.getGroups().subscribe({
      next: data => this.groups = data,
      error: err => console.error('Błąd pobierania grup:', err)
    });
  }

  getGroupName(groupId?: string): string {
    if (!groupId) return 'Brak grupy';
    const group  = this.groups.find(g => g.id === groupId);
    return group ? group .name : 'Brak grupy';
  }

  // dodawanie
  openAddModal() {
    this.showAddModal = true;
    this.addError = '';
    document.body.style.overflow = 'hidden';
    this.newAgent = { name: '', description: '', model: '', ipAddress: '', port: 9000, groupId: '', verificationCode: '' };
  }

  closeAddModal() {
    this.showAddModal = false;
    document.body.style.overflow = '';
  }

  saveNewAgent() {
    if (!this.newAgent.name || !this.newAgent.ipAddress || !this.newAgent.model || !this.newAgent.verificationCode) {
      this.addError = 'Wypełnij wszystkie wymagane pola';
      return;
    }

    this.isSavingAdd = true;

    this.agenciService.addAgent(this.newAgent as Agent).subscribe({
      next: added => {
        this.agents.push(added);
        this.isSavingAdd = false;
        this.closeAddModal();
      },
      error: err => {
        console.error('Błąd dodawania urządzenia:', err);
        this.addError = 'Nie udało się dodać urządzenia';
        this.isSavingAdd = false;
      }
    });
  }

  // edycja
  openEditModal(agent: Agent) {
    this.editAgentData = { ...agent };
    this.editError = '';
    document.body.style.overflow = 'hidden';
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    document.body.style.overflow = '';
  }

  saveEditAgent() {
    if (!this.editAgentData || !this.editAgentData.id) return;

    if (!this.editAgentData.name || !this.editAgentData.ipAddress || !this.editAgentData.model) {
      this.editError = 'Wypełnij wszystkie wymagane pola';
      return;
    }

    this.isSavingEdit = true;

    const payload: any = {
      ...this.editAgentData,
      verificationCode: '0000'
    };

    console.log(payload);

    this.agenciService.updateAgent(payload).subscribe({
      next: updated => {
        this.agents = this.agents.map(a => a.id === updated.id ? updated : a);
        this.isSavingEdit = false;
        this.closeEditModal();
      },
      error: err => {
        console.error('Błąd aktualizacji agenta:', err);
        this.editError = 'Nie udało się zaktualizować urządzenia';
        this.isSavingEdit = false;
      }
    });
  }

  // kasacja
  deleteAgent(id?: string) {
    if (!id || !confirm('Czy na pewno chcesz usunąć urządzenie?')) return;

    this.agenciService.deleteAgent(id).subscribe({
      next: () => this.agents = this.agents.filter(a => a.id !== id),
      error: err => console.error('Błąd usuwania agenta:', err)
    });
  }

  openDeleteModal(id?: string) {
    if (!id) return;
    this.agentIdToDelete = id;
    this.showDeleteModal = true;
    document.body.style.overflow = 'hidden';
  }

  confirmDelete() {
    if (!this.agentIdToDelete) return;

    this.isDeleting = true;

    this.agenciService.deleteAgent(this.agentIdToDelete).subscribe({
      next: () => {
        this.agents = this.agents.filter(a => a.id !== this.agentIdToDelete);
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Błąd usuwania agenta:', err);
        alert('Nie udało się usunąć urządzenia.');
        this.isDeleting = false;
      }
    });
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.agentIdToDelete = null;
    this.isDeleting = false;
    document.body.style.overflow = '';
  }

  // filtrowanie sortowanie
  filteredAgents(): Agent[] {
    let filtered = [...this.agents];

    if (this.searchTerm) {
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedGroupFilter) {
      if (this.selectedGroupFilter === 'none') {
        filtered = filtered.filter(a => !a.groupId);
      } else {
        filtered = filtered.filter(a => a.groupId === this.selectedGroupFilter);
      }
    }

    if (this.sortOption === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortOption === 'status') {
      filtered.sort((a, b) => Number(b.isOnline) - Number(a.isOnline));
    }

    return filtered;
  }
}
