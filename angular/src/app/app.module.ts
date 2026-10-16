import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { PathModule } from './path/path.module';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { FormsModule } from '@angular/forms';

@NgModule({
	providers: [AuthService, AuthGuardService],
	imports: [HttpClientModule, PathModule, FormsModule, TranslateModule],
	bootstrap: [AppComponent],
})
export class AppModule {}
