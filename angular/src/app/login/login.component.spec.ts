import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

describe('LoginComponent', () => {
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;
	let mockAuthService: jasmine.SpyObj<AuthService>;
	let mockRouter: jasmine.SpyObj<Router>;
	let mockActivatedRoute: { queryParams: Observable<Record<string, string>> };

	beforeEach(async () => {
		mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'login']);
		mockRouter = jasmine.createSpyObj('Router', ['navigate']);
		mockActivatedRoute = {
			queryParams: of({})
		};

		await TestBed.configureTestingModule({
			imports: [LoginComponent, TranslateModule.forRoot()],
			providers: [
				{ provide: AuthService, useValue: mockAuthService },
				{ provide: Router, useValue: mockRouter },
				{ provide: ActivatedRoute, useValue: mockActivatedRoute }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should redirect to /rncp if user is already logged in', () => {
		mockAuthService.isLoggedIn.and.returnValue(true);

		fixture.detectChanges(); // triggers ngOnInit

		expect(mockRouter.navigate).toHaveBeenCalledWith(['/rncp']);
	});

	it('should not redirect if user is not logged in', () => {
		mockAuthService.isLoggedIn.and.returnValue(false);

		fixture.detectChanges(); // triggers ngOnInit

		expect(mockRouter.navigate).not.toHaveBeenCalled();
	});

	it('should handle OAuth callback with code parameter', () => {
		mockAuthService.isLoggedIn.and.returnValue(false);
		mockActivatedRoute.queryParams = of({ code: 'test-auth-code' });

		fixture.detectChanges(); // triggers ngOnInit

		expect(mockAuthService.login).toHaveBeenCalledWith('test-auth-code');
		expect(mockRouter.navigate).toHaveBeenCalledWith(['/rncp']);
	});

	it('should not call login if no code parameter is present', () => {
		mockAuthService.isLoggedIn.and.returnValue(false);
		mockActivatedRoute.queryParams = of({});

		fixture.detectChanges(); // triggers ngOnInit

		expect(mockAuthService.login).not.toHaveBeenCalled();
	});

	it('should return correct login status from isLoggedIn method', () => {
		mockAuthService.isLoggedIn.and.returnValue(true);
		expect(component.isLoggedIn()).toBe(true);

		mockAuthService.isLoggedIn.and.returnValue(false);
		expect(component.isLoggedIn()).toBe(false);
	});
});
