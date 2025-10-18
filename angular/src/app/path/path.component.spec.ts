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

	it('should calculate unique planned projects XP correctly', () => {
		// Create test projects
		const project1: Project = {
			id: 1,
			name: 'Project 1',
			slug: 'project-1',
			xp: 10000
		};

		const project2: Project = {
			id: 2,
			name: 'Project 2',
			slug: 'project-2',
			xp: 20000
		};

		// Create project users
		const projectUser1: ProjectUser = {
			id: 1,
			occurrence: 10000,
			final_mark: 100,
			status: '',
			'validated?': true,
			current_team_id: 0,
			project: project1,
			cursus_ids: [21]
		};

		const projectUser2: ProjectUser = {
			id: 2,
			occurrence: 20000,
			final_mark: 100,
			status: '',
			'validated?': true,
			current_team_id: 0,
			project: project2,
			cursus_ids: [21]
		};

		// Set up blocks with different projects
		const blockComponent1 = {
			planned_projects: [projectUser1, projectUser2]
		} as BlockComponent;

		const blockComponent2 = {
			planned_projects: [projectUser2]
		} as BlockComponent;

		const queryList = new QueryList<BlockComponent>();
		queryList.reset([blockComponent1, blockComponent2]);
		component.blockComponents = queryList;

		// Call the private method through getPlannedLevel
		// Since the method is private, we test it indirectly
		mockAuthService.getLevel.and.returnValue(0);
		component.plannedInternships = [];
		
		const level = component.getPlannedLevel();
		
		// With 30000 XP total (10000 + 20000, where project2 is not double-counted)
		// Starting from level 0, we should be above level 0
		expect(level).toBeGreaterThan(0);
	});

	it('should deduplicate projects across blocks when calculating planned level', () => {
		// Create a mock project that appears in multiple blocks
		const sharedProject: Project = {
			id: 2071,
			name: 'BADASS',
			slug: 'badass',
			xp: 22450
		};

		const sharedProjectUser100: ProjectUser = {
			id: 2071,
			occurrence: 22450, // 100% grade
			final_mark: 100,
			status: '',
			'validated?': true,
			current_team_id: 0,
			project: sharedProject,
			cursus_ids: [21]
		};

		const sharedProjectUser110: ProjectUser = {
			id: 2071,
			occurrence: 24695, // 110% grade (22450 * 1.1)
			final_mark: 110,
			status: '',
			'validated?': true,
			current_team_id: 0,
			project: sharedProject,
			cursus_ids: [21]
		};

		// Create mock block components with same project at different grades
		const mockBlockComponent1 = {
			planned_projects: [sharedProjectUser100]
		} as BlockComponent;

		const mockBlockComponent2 = {
			planned_projects: [sharedProjectUser110]
		} as BlockComponent;

		// Set up the blockComponents QueryList
		const queryList = new QueryList<BlockComponent>();
		queryList.reset([mockBlockComponent1, mockBlockComponent2]);
		component.blockComponents = queryList;

		// Mock the getLevel to return a base level
		mockAuthService.getLevel.and.returnValue(10);

		// Call getPlannedLevel - it should take the maximum XP (110% grade)
		const plannedLevel = component.getPlannedLevel();

		// The XP should be counted only once with the higher grade
		expect(plannedLevel).toBeGreaterThan(10);
		
		// Now test with only the 100% grade project
		queryList.reset([mockBlockComponent1, mockBlockComponent1]);
		const plannedLevelWith100 = component.getPlannedLevel();
		
		// The 110% version should give a higher level than 100%
		expect(plannedLevel).toBeGreaterThan(plannedLevelWith100);
		
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

		mockBlockComponent1.planned_projects = [sharedProjectUser100];
		mockBlockComponent2.planned_projects = [differentProject];
		queryList.reset([mockBlockComponent1, mockBlockComponent2]);

		const plannedLevelWithDifferent = component.getPlannedLevel();
		
		// With two different projects, the level should be higher than with just one
		expect(plannedLevelWithDifferent).toBeGreaterThan(plannedLevelWith100);
	});
});
