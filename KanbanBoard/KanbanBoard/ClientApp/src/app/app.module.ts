import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './shared/nav-menu/nav-menu.component';
import { DashboardComponent } from './dashboard-module/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule} from '@angular/material/button';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
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
import { AddBoardComponent } from './dashboard-module/add-board/add-board.component';
import { MatDialogModule} from '@angular/material/dialog';
import { AddTeamComponent } from './dashboard-module/add-team/add-team.component';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { SettingsComponent } from './settings-module/settings/settings.component';
import { RegisterComponent } from './register/register.component';
import { MatTabsModule } from "@angular/material/tabs";
import { SettingsAccountComponent } from './settings-module/settings-account/settings-account.component';
import { SettingsNotificationsComponent } from './settings-module/settings-notifications/settings-notifications.component';
import { ProfileComponent } from './profile-module/profile/profile.component';
import { AuthGuardService as AuthGuard } from "./shared/auth/auth-guard.service";
import { SideNavComponent } from './shared/side-nav/side-nav.component';
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { TeamComponent } from './team-module/team/team.component';
import { MatSortModule } from "@angular/material/sort";
import { TicketsDatatableComponent } from './shared/tickets-datatable/tickets-datatable.component';
import { EditTicketComponent } from "./ticket-module/edit-ticket/edit-ticket.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { SettingsLabelsComponent} from './settings-module/settings-labels/settings-labels.component';
import { MatTooltipModule } from "@angular/material/tooltip";
import { AddLabelComponent } from './settings-module/settings-labels/add-label/add-label.component';
import { MatChipsModule } from "@angular/material/chips";
import { SettingsBoardsComponent } from './settings-module/settings-boards/settings-boards.component';
import { EditBoardComponent } from './settings-module/settings-boards/edit-board/edit-board.component';
import { DragDropModule } from "@angular/cdk/drag-drop";

const routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'settings/:id', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'team/:id', component: TeamComponent, canActivate: [AuthGuard] },
  { path: 'ticket/:id', component: EditTicketComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    DashboardComponent,
    LoginComponent,
    AddBoardComponent,
    AddTeamComponent,
    ConfirmationDialogComponent,
    SettingsComponent,
    RegisterComponent,
    SettingsAccountComponent,
    SettingsNotificationsComponent,
    ProfileComponent,
    SideNavComponent,
    TeamComponent,
    TicketsDatatableComponent,
    EditTicketComponent,
    SettingsLabelsComponent,
    AddLabelComponent,
    SettingsBoardsComponent,
    EditBoardComponent
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
    MatTabsModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatChipsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    AddBoardComponent,
    AddTeamComponent,
    ConfirmationDialogComponent,
    AddLabelComponent
  ]
})
export class AppModule { }
