import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Block, Project, ProjectUser } from '../../models/me';

@Component({
	selector: 'app-block',
	templateUrl: './block.component.html',
	styleUrl: './block.component.css',
})
export class BlockComponent implements OnInit {
	@Input() block!: Block;
	@Input() projects?: ProjectUser[];
	@Output() completionStatus: EventEmitter<boolean> = new EventEmitter<boolean>();
	activeProjectIndex: number | null = null;
	xp: number = 0;
	completed_projects: ProjectUser[] = [];
	completed: boolean = false;
	planned_projects: ProjectUser[] = [];
	slider_mark: number = 100;
	show_slider: boolean = false;
	plannedProjects: ProjectUser[] = []; // P2c25

	constructor(private changeDetectorRef: ChangeDetectorRef) {}

	get estimatedXP(): number {
		let planned_xp = this.planned_projects.reduce(
			(acc, project) => acc + project.occurrence,
			0
		);
		this.block.projects.forEach((project: Project) => {
			if (!this.isCompleted(project)) {
				planned_xp += Number(project.xp);
				// to integer
				planned_xp = Math.round(planned_xp);
			}
		});
		return planned_xp;
	}

	isCompleted($event: Project) {
		return this.completed_projects.find((project: ProjectUser) => {
			return project.project.id == $event.id && project['validated?'];
		});
	}

	get completed_project_number(): number {
		return this.completed_projects.length + this.planned_projects.length;
	}

	isBlockCompleted() {
		this.completed =
			this.xp >= this.block.min_xp &&
			this.completed_projects.length + this.planned_projects.length >=
				this.block.min_projects;
		this.completionStatus.emit(this.completed);
		return this.completed;
	}

	planProject(project: Project): void {
		this.show_slider = false;
		this.slider_mark = 100;
		if (!this.isCompleted(project) && !this.isPlanned(project)) {
			this.planned_projects.push({
				id: project.id,
				xp: project.xp,
				name: project.name,
				slug: project.slug,
				occurrence: project.xp * 1,
				final_mark: 100,
				status: '',
				'validated?': true,
				current_team_id: 0,
				project: project,
				cursus_ids: [21],
			} as ProjectUser);
			this.plannedProjects.push({
				id: project.id,
				xp: project.xp,
				name: project.name,
				slug: project.slug,
				occurrence: project.xp * 1,
				final_mark: 100,
				status: '',
				'validated?': true,
				current_team_id: 0,
				project: project,
				cursus_ids: [21],
			} as ProjectUser); // P924b
		} else if (this.isPlanned(project)) {
			const proj = this.planned_projects.find((projectUser: ProjectUser) => {
				return projectUser.project.id == project.id;
			});
			if (proj)
				this.planned_projects = this.planned_projects.filter((projectUser: ProjectUser) => {
					return projectUser.project.id != project.id;
				});
			this.plannedProjects = this.plannedProjects.filter((projectUser: ProjectUser) => {
				return projectUser.project.id != project.id;
			}); // P924b
		}
		this.isBlockCompleted();
		this.show_slider = false;
		this.calculateXP();
	}
	isPlanned(project: Project): boolean {
		return this.planned_projects.find((projectUser: ProjectUser) => {
			return projectUser.project.id == project.id;
		})
			? true
			: false;
	}

	ngOnInit() {
		if (this.projects) {
			this.completed_projects = this.projects.filter((project: ProjectUser) => {
				if (
					this.block.projects.find(p => {
						if (p.id == project.project.id) {
							this.xp += (p.xp * project.final_mark) / 100;
							this.xp = Math.floor(this.xp);
							return true;
						}
						return false;
					})
				) {
					return true;
				}
				return false;
			});
		}
	}

	toggleSlider(event: MouseEvent, index: number) {
		event.stopPropagation();
		this.show_slider = !this.show_slider;
		this.activeProjectIndex = this.activeProjectIndex === index ? null : index;
		const project: Project | undefined = this.block.projects[index];
		const projectUser: ProjectUser | undefined = this.planned_projects?.find(p => p.project.id == project?.id);
		this.slider_mark = projectUser?.final_mark ?? 100;
		this.changeDetectorRef.detectChanges();
	}

	event($event: Event) {
		this.show_slider = true;
		$event.preventDefault();
		$event.stopPropagation();
	}

	setPlannedXP(project: Project, target: EventTarget | null) {
		if (target === null) {
			return;
		}
		const mark = parseInt((target as HTMLInputElement).value);
		const new_xp = Math.round((project.xp * mark) / 100);
		const found: ProjectUser | undefined = this.planned_projects.find(
			(projectUser: ProjectUser) => {
				if (projectUser.project.id == project.id) {
					projectUser.final_mark = mark;
					projectUser.occurrence = new_xp;
					return true;
				}
				return false;
			}
		);

		this.slider_mark = mark;

		if (!found) {
			this.planned_projects.push({
				id: project.id,
				final_mark: mark,
				name: project.name,
				slug: project.slug,
				occurrence: new_xp,
				status: '',
				'validated?': true,
				current_team_id: 0,
				project: project,
				cursus_ids: [21],
			} as ProjectUser);
		}

		this.calculateXP();
	}

	calculateXP() {
		this.xp = 0;
		this.planned_projects.forEach((project: ProjectUser) => {
			this.xp += (project.final_mark * project.project.xp) / 100;
		});
		this.block.planned_xp = this.planned_projects
		.filter((p: ProjectUser) => !this.isCompleted(p.project))
		.reduce((acc, p) => acc + p.occurrence, 0);
		this.block.projects.forEach((project: Project) => {
			if (this.isCompleted(project)) {
				const project_user = this.completed_projects.find((projectUser: ProjectUser) => {
					return projectUser.project.id == project.id;
				});
				if (project_user) {
					this.xp += (project_user.final_mark * project.xp) / 100;
					this.xp = Math.round(this.xp);
				}
			}
		});
		this.plannedProjects.forEach((project: ProjectUser) => {
			if (!this.isCompleted(project.project)) {
				this.xp += (project.final_mark * project.project.xp) / 100;
			}
		}); // P43be
	}

	getPlannedXP(project: Project): number {
		let mark = 0;
		const found: ProjectUser | undefined = this.planned_projects.find(
			(projectUser: ProjectUser) => {
				if (projectUser.project.id == project.id) {
					return true;
				}
				return false;
			}
		);
		if (found) {
			return found.occurrence;
		}
		if (
			this.completed_projects.find((projectUser: ProjectUser) => {
				if (projectUser.project.id == project.id) {
					mark = projectUser.final_mark;
					return true;
				}
				return false;
			})
		) {
			return Math.round((project.xp * mark) / 100);
		}
		return 0;
	}
}
