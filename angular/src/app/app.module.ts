import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { customLangFactory } from './CustomLangFactory';
import { PathModule } from './path/path.module';

@NgModule({
	imports: [
		HttpClientModule,
		PathModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: customLangFactory,
				deps: [HttpClient]
			}
		})
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
