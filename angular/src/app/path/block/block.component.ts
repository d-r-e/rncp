import { CommonModule } from '@angular/common';
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Block, Project, ProjectUser } from '../../models/me';

@Component({
  selector: 'app-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './block.component.html',
  styleUrl: './block.component.css'
})
export class BlockComponent implements OnInit {

  @Input() block!: Block;
  @Input() projects?: ProjectUser[];
  @Output() completionStatus: EventEmitter<boolean> = new EventEmitter<boolean>();

  xp: number = 0;
  completed_projects: ProjectUser[] = [];
  completed: boolean = false;
  completed_project_number: number = 0;
  planned_projects: number[] = [];
  estimatedXP: number = 0;

  constructor() {
  }

  isCompleted($event: Project) {
    return this.completed_projects.find((project: ProjectUser) => {
      return project.project.id == $event.id;
    });
  }

  isBlockCompleted() {
    this.completed = this.estimatedXP >= this.block.min_xp && this.completed_project_number >= this.block.min_projects;
    this.completionStatus.emit(this.completed);
    return this.completed;
  }

  planProject(project: Project): void {
    if (!this.isCompleted(project) && !this.isPlanned(project)) {
      this.planned_projects.push(project.id);
      this.estimatedXP += project.xp;
      this.completed_project_number++;

    } else if (this.isPlanned(project)) {
      this.planned_projects = this.planned_projects.filter((id: number) => {
        return id != project.id;
      });
      this.estimatedXP -= project.xp;
      this.completed_project_number--;
    }
    this.isBlockCompleted();

  }
  isPlanned(project: Project): boolean {
    return this.planned_projects.includes(project.id);
  }

  ngOnInit() {
    if (this.projects) {

      console.log(this.projects);
      this.completed_projects = this.projects.filter((project: ProjectUser) => {
        if (this.block.projects.find(p => {
          if (p.id == project.project.id) {
            console.log(p.xp * project.final_mark / 100);
            this.xp += p.xp * project.final_mark / 100;
            this.xp = Math.round(this.xp);
            return true;
          }
          return false;
        })) {
          return true;
        }
        return false;
      }
      );
    }
    this.completed_project_number = this.completed_projects.length;
    this.estimatedXP = this.xp;
    this.isBlockCompleted();
  }
}
