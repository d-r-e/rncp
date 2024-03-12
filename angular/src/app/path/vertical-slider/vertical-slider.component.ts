import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-vertical-slider',
	templateUrl: './vertical-slider.component.html',
	styleUrl: './vertical-slider.component.css',
})
export class VerticalSliderComponent {
	@Input() bindElement!: HTMLElement;
	@Input() min: number = 0;
	@Input() max: number = 100;
	@Input() step: number = 1;
	@Output() valueChange = new EventEmitter<number>();

	public value: number;
	public showSlider: boolean = true;
	public showValue: boolean = false;

	constructor() {
		this.value = this.min;
	}

	onValueChange(newValue: number) {
		this.value = newValue;
		this.valueChange.emit(this.value);
		this.showValue = true;
	}

	toggleSliderDisplay() {
		this.showSlider = !this.showSlider;
	}

	onSliderLeave() {
		this.showValue = false;
	}
}
