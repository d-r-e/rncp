import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { customLangFactory } from './CustomLangFactory';
import { PathModule } from './path/path.module';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';

@NgModule({
	providers: [AuthService, AuthGuardService],
	imports: [
		HttpClientModule,
		PathModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: customLangFactory,
				deps: [HttpClient],
			},
		}),
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
