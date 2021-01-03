import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule} from '@angular/material/button';
import { MatOptionModule, MatRippleModule} from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MaterialElevationDirective } from './directives/material-elevation.directive';
import { AddBoardComponent } from './add-board/add-board.component';
import { MatDialogModule} from '@angular/material/dialog';
import { AddTeamComponent } from './add-team/add-team.component';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { SettingsComponent } from './settings/settings.component';
import { RegisterComponent } from './register/register.component';
import {MatTabsModule} from "@angular/material/tabs";
import { SettingsAccountComponent } from './settings-account/settings-account.component';

const routes = [
  { path: '', component: LoginComponent, pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    DashboardComponent,
    LoginComponent,
    MaterialElevationDirective,
    AddBoardComponent,
    AddTeamComponent,
    ConfirmationDialogComponent,
    SettingsComponent,
    RegisterComponent,
    SettingsAccountComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatRippleModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    AddBoardComponent,
    AddTeamComponent,
    ConfirmationDialogComponent
  ]
})
export class AppModule { }
