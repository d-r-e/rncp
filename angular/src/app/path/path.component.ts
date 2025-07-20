import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Block, CursusEvent, ProjectUser } from '../models/me';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

// from https://42evaluators.com/calculator
const levelsXp = [
  0, 462, 2688, 5885, 11777, 29217, 46255, 63559, 74340, 85483, 95000, 105630,
  124446, 145782, 169932, 197316, 228354, 263508, 303366, 348516, 399672, 457632,
  523320, 597786, 682164, 777756, 886074, 1008798, 1147902, 1305486, 1484070];

interface Internship {
  name: string;
  baseXP: number;
  grade: number;
}

@Component({
  selector: 'app-path',
  templateUrl: './path.component.html',
  styleUrl: './path.component.css',
})
export class PathComponent implements OnInit {
  events: number = 0;
  rncp: number = 6;
  blocks: Block[] = [];
  projects: ProjectUser[] = [];
  requiredLevel: number = 17;
  requiredEvents: number = 10;
  internships: number = 0;
  requiredInternships: number = 2;
  plannedInternships: Internship[] = [];
  path: 'web' | 'apps' | 'sec' | 'ai' = 'ai';
  selectedInternship?: Internship;  // To store the currently selected internship
  selectedGrade: number = 100;  // Default grade value
  inputValue: number = 100;

  availableInternships: Internship[] =
    [
      { name: 'Work Experience I', baseXP: 42000, grade: 100 },
      { name: 'Work Experience II', baseXP: 63000, grade: 100 },
    ]
  showInternshipForm: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private translate: TranslateService
  ) {
    const internshipProjects = this.authService.getInternships();
    this.availableInternships = this.availableInternships.filter(i=> !internshipProjects.find(p=> p.name === i.name));
    this.internships = internshipProjects.length;

    this.authService.getEvents().subscribe((events: CursusEvent[]) => {
      this.events = events.length;
    });

    if (this.authService.me) {
      this.projects = this.authService.me.projects_users.filter(
        (project: ProjectUser) =>
          project.cursus_ids.includes(21) && project['validated?']
      );
    }
  }

  ngOnInit(): void {
    this.setRNCP(7);
  }

  loadData() {
    this.http.get(`assets/${this.rncp}-${this.path}.json`).subscribe(response => {
      this.blocks = response as Block[];
    });
  }

  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newValue = Number(inputElement.value);
    this.selectedGrade = newValue;
  }

  selectInternship(internship: Internship) {
    this.selectedInternship = internship;
  }

  addPlannedInternship() {
    if (!this.selectedInternship) return;
    if (this.selectedGrade < 100 || this.selectedGrade > 125) return;
  
    const existingInternship = this.plannedInternships.find(
      i => i.name === this.selectedInternship?.name
    );
  
    if (!existingInternship) {
      this.plannedInternships.push({
        ...this.selectedInternship,
        grade: this.selectedGrade
      });
      this.updatePlannedXP();
      this.internships++;
    } else {
      existingInternship.grade = this.selectedGrade;
      this.updatePlannedXP();
    }
  
    this.selectedInternship = undefined;
    this.selectedGrade = 100;
  }

  updatePlannedXP() {
    const totalPlannedXP = this.plannedInternships.reduce((total, internship) => {
      const xp = internship.baseXP * (internship.grade ? internship.grade / 100 : 1);
      return total + xp;
    }, 0);

    // Here you could update your UI or any other relevant property with the calculated XP
    console.log('Total Planned XP:', totalPlannedXP);
  }

  setRNCP(level: number) {
    this.rncp = level;
    this.requiredLevel = level == 6 ? 17 : 21;
    this.requiredEvents = level == 6 ? 10 : 15;
    this.path = level == 6 ? 'web' : 'sec';
    this.loadData();
  }

  setPath(path: 'web' | 'apps' | 'sec' | 'ai') {
    this.path = path;
    this.loadData();
  }

  getLevel() {
    return this.authService.getLevel();
  }

  getPlannedLevel() {
    const startLevel = this.getLevel();
    let plannedXp = this.blocks.map((block: Block) => block.planned_xp).reduce((acc, xp) => acc + (xp ?? 0), 0);
    plannedXp += this.plannedInternships.map((internship: Internship) => internship.baseXP * internship.grade / 100).reduce((acc, xp) => acc + xp, 0);
    const levelDown = Math.floor(startLevel);
    const levelUp = Math.ceil(startLevel);
    const levelXpTotal = levelsXp[levelUp] - levelsXp[levelDown];
    const currentXp = levelsXp[levelDown] + (levelXpTotal * (startLevel - Math.floor(startLevel)));

    let finalXp = currentXp + plannedXp;

    let i = 0;
    for (; i < levelsXp.length; i++) {
      if (levelsXp[i] > finalXp) break;
    }

    const maxXp = levelsXp[i] - levelsXp[i - 1];
    finalXp = finalXp - levelsXp[i - 1];

    return i - 1 + (finalXp / maxXp);
  }
}
