import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-progressbar',
	templateUrl: './progressbar.component.html',
	styleUrl: './progressbar.component.css',
})
export class ProgressbarComponent {
	@Input() current: number = 0;
	@Input() min: number = 0;
	@Input() max: number = 100;

	@Input() discrete: boolean = false;

	get percentage(): string {
		const range = this.max - this.min;
		const progress = ((this.current - this.min) / range) * 100;
		if (progress < 0) {
			return `0%`;
		} else if (progress > 100) {
			return `100%`;
		}
		return `${progress}%`;
	}

	get discreteBlocks(): number[] {
		const range = this.max - this.min;
		const totalBlocks = 10; // Define the number of blocks you want
		const blocksFilled = Math.round(((this.current - this.min) / range) * totalBlocks);
		return Array.from({ length: totalBlocks }, (_, index) => (index < blocksFilled ? 1 : 0));
	}
}
