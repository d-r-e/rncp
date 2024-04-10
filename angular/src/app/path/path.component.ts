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
	523320, 597786, 682164, 777756, 886074, 1008798, 1147902, 1305486, 1484070 ];

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
	path: 'web' | 'apps' | 'sec' | 'ai' = 'ai';

	constructor(
		private authService: AuthService,
		private router: Router,
		private http: HttpClient,
		private translate: TranslateService
	) {
		this.internships = this.authService.getInternships().length;

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
		let startLevel = this.getLevel();
		let plannedXp = this.blocks.map((block: Block) => block.planned_xp).reduce((acc, xp) => acc + (xp ?? 0), 0);

		let levelDown = Math.floor(startLevel);
		let levelUp = Math.ceil(startLevel);
		let levelXpTotal = levelsXp[levelUp] - levelsXp[levelDown];
		let currentXp = levelsXp[levelDown] + (levelXpTotal * (startLevel - Math.floor(startLevel)));

		let finalXp = currentXp + plannedXp;

		for (var i = 0; i < levelsXp.length; i++) {
			if (levelsXp[i] > finalXp) break;
		}

		let maxXp = levelsXp[i] - levelsXp[i - 1];
		finalXp = finalXp - levelsXp[i - 1];

		return i - 1 + (finalXp / maxXp);
	}
}
