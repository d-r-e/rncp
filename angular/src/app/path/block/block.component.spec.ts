import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BlockComponent } from './block.component';

describe('BlockComponent', () => {
	let component: BlockComponent;
	let fixture: ComponentFixture<BlockComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BlockComponent],
			imports: [TranslateModule.forRoot()],
		}).compileComponents();

		fixture = TestBed.createComponent(BlockComponent);
		component = fixture.componentInstance;
		
		// Set up required inputs
		component.block = {
			id: 1,
			name: 'Test Block',
			projects: [],
			planned_xp: 0,
			min_xp: 0,
			min_projects: 0
		};
		
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
