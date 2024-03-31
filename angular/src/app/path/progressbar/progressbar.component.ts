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
	@Input() blocksCount: number = 10;

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
		const blocksFilled = Math.round(((this.current - this.min) / range) * this.blocksCount);
		return Array.from({ length: this.blocksCount }, (_, index) => index < blocksFilled ? 1 : 0);
	}
}
