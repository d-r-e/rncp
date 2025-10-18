import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PathComponent } from './path.component';
import { BlockComponent } from './block/block.component';
import { AuthService } from '../services/auth.service';
import { QueryList } from '@angular/core';
import { ProjectUser, Project } from '../models/me';
import { Observable } from 'rxjs';

describe('PathComponent', () => {
	let component: PathComponent;
	let fixture: ComponentFixture<PathComponent>;
	let mockAuthService: jasmine.SpyObj<AuthService>;

	beforeEach(async () => {
		mockAuthService = jasmine.createSpyObj('AuthService', ['getLevel', 'getInternships', 'getEvents']);
		mockAuthService.getLevel.and.returnValue(10);
		mockAuthService.getInternships.and.returnValue([]);
		mockAuthService.getEvents.and.returnValue(new Observable());
		
		await TestBed.configureTestingModule({
			declarations: [PathComponent, BlockComponent],
			imports: [HttpClientTestingModule, TranslateModule.forRoot()],
			providers: [
				{ provide: AuthService, useValue: mockAuthService }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(PathComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should deduplicate projects across blocks when calculating planned level', () => {
		// Create a mock project that appears in multiple blocks
		const sharedProject: Project = {
			id: 2071,
			name: 'BADASS',
			slug: 'badass',
			xp: 22450
		};

		const sharedProjectUser: ProjectUser = {
			id: 2071,
			occurrence: 22450,
			final_mark: 100,
			status: '',
			'validated?': true,
			current_team_id: 0,
			project: sharedProject,
			cursus_ids: [21]
		};

		// Create mock block components
		const mockBlockComponent1 = {
			planned_projects: [sharedProjectUser]
		} as BlockComponent;

		const mockBlockComponent2 = {
			planned_projects: [sharedProjectUser]
		} as BlockComponent;

		// Set up the blockComponents QueryList
		const queryList = new QueryList<BlockComponent>();
		queryList.reset([mockBlockComponent1, mockBlockComponent2]);
		component.blockComponents = queryList;

		// Mock the getLevel to return a base level
		mockAuthService.getLevel.and.returnValue(10);

		// Call getPlannedLevel - it should deduplicate the shared project
		const plannedLevel = component.getPlannedLevel();

		// The XP should be counted only once, not twice
		// With base level 10 and 22450 XP added, we can verify it's not doubled
		// If it were counted twice (44900), the level would be higher
		expect(plannedLevel).toBeGreaterThan(10);
		
		// Let's also test that two different projects ARE counted
		const differentProject: ProjectUser = {
			id: 9999,
			occurrence: 10000,
			final_mark: 100,
			status: '',
			'validated?': true,
			current_team_id: 0,
			project: { id: 9999, name: 'Different', slug: 'different', xp: 10000 },
			cursus_ids: [21]
		};

		mockBlockComponent1.planned_projects = [sharedProjectUser];
		mockBlockComponent2.planned_projects = [differentProject];
		queryList.reset([mockBlockComponent1, mockBlockComponent2]);

		const plannedLevelWithDifferent = component.getPlannedLevel();
		
		// With two different projects, the level should be higher than with just one
		expect(plannedLevelWithDifferent).toBeGreaterThan(plannedLevel);
	});
});
