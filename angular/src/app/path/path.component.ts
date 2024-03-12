import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Block, CursusEvent, ProjectUser } from '../models/me';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

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
				(project: ProjectUser) => project.cursus_ids.includes(21) && project.status == "finished");
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
		this.rncp = level
		this.requiredLevel = (level == 6) ? 17 : 21;
		this.requiredEvents = (level == 6) ? 10 : 15;
		this.path = (level == 6) ? 'web' : 'sec';
		this.loadData();
	}

	setPath(path: 'web' | 'apps' | 'sec' | 'ai') {
		this.path = path;
		this.loadData();
	}

	getLevel() {
		return this.authService.getLevel();
	}
}
