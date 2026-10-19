import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { customLangFactory } from './CustomLangFactory';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection(),
		importProvidersFrom(
			HttpClientModule,
			TranslateModule.forRoot({
				loader: {
					provide: TranslateLoader,
					useFactory: customLangFactory,
					deps: [HttpClient],
				},
			})
		),
		provideRouter(routes),
	],
};
