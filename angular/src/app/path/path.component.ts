import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ProgressbarComponent } from "./progressbar/progressbar.component";
import { Block, CursusEvent, ProjectUser } from '../models/me';
import { HttpClient } from '@angular/common/http';
import { BlockComponent } from "./block/block.component";

@Component({
    selector: 'app-path',
    standalone: true,
    templateUrl: './path.component.html',
    styleUrl: './path.component.css',
    imports: [CommonModule, ProgressbarComponent, BlockComponent]
})
export class PathComponent implements OnInit {

  events: number = 0;
  rncp: number = 6;
  blocks: Block[] = [];
  projects: ProjectUser[] = [];
  requiredLevel: number = 17;
  requiredEvents: number = 10;
  internships: number = 0;
  requiredInternships : number = 2;

  constructor(private authService: AuthService, private router: Router,
    private http: HttpClient) {
    this.internships = this.authService.getInternships().length;
    this.authService.getEvents().subscribe((events:CursusEvent[]) => {
      this.events = events.length;
    });
    if (this.authService.me)
    {
      this.projects = this.authService.me.projects_users.filter((project: ProjectUser) => {
        return project.cursus_ids.includes(21 ) && project.status == "finished";
      });

  }
  }

  ngOnInit(): void {
    this.setRNCP(7);
    this.loadData(this.rncp);
  }

  loadData(rncp: number) {
    this.http.get(`assets/${rncp}.json`).subscribe(response => {
      this.blocks = response as Block[];
    });
  }

  setRNCP(level: number) {
    this.rncp = level
    this.requiredLevel = (level == 6) ? 17 : 21;
    this.requiredEvents = (level == 6) ? 10 : 15;
  }

  getLevel() {
    return this.authService.getLevel();
  }
}
