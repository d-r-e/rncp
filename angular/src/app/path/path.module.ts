import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PathComponent } from './path.component';
import { ProgressbarComponent } from './progressbar/progressbar.component';
import { BlockComponent } from './block/block.component';
import { TranslateModule } from '@ngx-translate/core';
import { VerticalSliderComponent } from './vertical-slider/vertical-slider.component';

@NgModule({
	declarations: [PathComponent, ProgressbarComponent, BlockComponent, VerticalSliderComponent],
	imports: [CommonModule, TranslateModule],
	exports: [PathComponent, ProgressbarComponent, BlockComponent, VerticalSliderComponent],
})
export class PathModule {}
