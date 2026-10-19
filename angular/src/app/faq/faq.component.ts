import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import packageJson from '@app/package.json';

interface Contributor {
	name: string;
	email: string;
	url: string;
}

@Component({
	selector: 'app-faq',
	standalone: true,
	imports: [CommonModule, TranslateModule],
	templateUrl: './faq.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './faq.component.css',
})
export class FaqComponent implements OnInit {
	public contributors: Contributor[] = [];

	ngOnInit(): void {
		this.contributors = packageJson.contributors as Contributor[];
	}
}
