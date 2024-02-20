import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ProgressbarComponent } from "./progressbar/progressbar.component";
import { CursusEvent } from '../models/me';

@Component({
  selector: 'app-path',
  standalone: true,
  templateUrl: './path.component.html',
  styleUrl: './path.component.css',
  imports: [CommonModule, ProgressbarComponent]
})
export class PathComponent implements OnInit {

  events: number = 0;
  rncp: number = 6;
  requiredLevel: number = 17;
  requiredEvents: number = 10;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.getEvents().subscribe((events:CursusEvent[]) => {
      console.log(events);
      this.events = events.length;

    });
  }

  ngOnInit(): void {
    this.setRNCP(7);
  }

  setRNCP(level: number) {
    this.rncp = level
    this.requiredLevel = (level == 6) ? 17 : 42;
    this.requiredEvents = (level == 6) ? 10 : 15;
  }

  getLevel() {
    return this.authService.getLevel();
  }
}
