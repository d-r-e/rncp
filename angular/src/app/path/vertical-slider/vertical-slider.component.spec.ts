import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalSliderComponent } from './vertical-slider.component';

describe('VerticalSliderComponent', () => {
	let component: VerticalSliderComponent;
	let fixture: ComponentFixture<VerticalSliderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [VerticalSliderComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(VerticalSliderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
