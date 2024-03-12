import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PathComponent } from './path.component';
import { ProgressbarComponent } from './progressbar/progressbar.component';
import { BlockComponent } from './block/block.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { customLangFactory } from '../CustomLangFactory';
import { VerticalSliderComponent } from './vertical-slider/vertical-slider.component';


@NgModule({
	declarations: [
		PathComponent,
		ProgressbarComponent,
		BlockComponent,
		VerticalSliderComponent
	],
	imports: [
		CommonModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: customLangFactory,
				deps: [HttpClient]
			}
		})
	],
	exports: [
		PathComponent,
		ProgressbarComponent,
		BlockComponent,
		VerticalSliderComponent
	]
})
export class PathModule { }
