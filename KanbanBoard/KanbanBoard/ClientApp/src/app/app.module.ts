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
import { ViewTicketComponent } from "./ticket-module/view-ticket/view-ticket.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { SettingsLabelsComponent} from './settings-module/settings-labels/settings-labels.component';
import { MatTooltipModule } from "@angular/material/tooltip";
import { AddLabelComponent } from './settings-module/settings-labels/add-label/add-label.component';
import { MatChipsModule } from "@angular/material/chips";
import { SettingsBoardsComponent } from './settings-module/settings-boards/settings-boards.component';
import { EditBoardComponent } from './settings-module/settings-boards/edit-board/edit-board.component';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from '@angular/material';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { BoardComponent } from './board-module/board/board.component';
import { BoardColumnComponent } from './board-module/board-column/board-column.component';
import { BoardTicketComponent } from './board-module/board-ticket/board-ticket.component';
import { BoardCardComponent } from './dashboard-module/dashboard/board-card/board-card.component';
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ChartsModule, ThemeService } from "ng2-charts";
import { FinishedPercentageComponent } from './statistics-module/finished-percentage/finished-percentage.component';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { TeamCardComponent } from './dashboard-module/dashboard/team-card/team-card.component';
import { TicketPriorityComponent } from './shared/ticket-priority/ticket-priority.component';
import { AddTicketComponent } from './ticket-module/add-ticket/add-ticket.component';
import { CommentComponent } from './comment-module/comment/comment.component';
import { CommentSectionComponent } from './comment-module/comment-section/comment-section.component';
import { TimerComponent } from './timer-module/timer/timer.component';
import { StatisticsComponent } from './statistics-module/statistics/statistics.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { CommonModule } from "@angular/common";
import { ViewWeekComponent } from "./statistics-module/view-week/view-week.component";
import { VerticalViewComponent } from "./statistics-module/vertical-view/vertical-view.component";
import { SingleViewWeekComponent } from './statistics-module/single-view-week/single-view-week.component';
import { EditLabelComponent } from './settings-module/settings-labels/edit-label/edit-label.component';

export function momentAdapterFactory() {
  return adapterFactory(moment);
};

moment.updateLocale('en', {
  week: {
    dow: 1,
    doy: 0
  }
});

const routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'settings/:id', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'team/:id', component: TeamComponent, canActivate: [AuthGuard] },
  { path: 'task/:id', component: ViewTicketComponent, canActivate: [AuthGuard] },
  { path: 'board/:id', component: BoardComponent, canActivate: [AuthGuard] },
  { path: 'statistics/:id', component: StatisticsComponent, canActivate: [AuthGuard] },
  { path: 'weekView/:id', component: ViewWeekComponent, canActivate: [AuthGuard] },
  { path: 'verticalView', component: VerticalViewComponent, canActivate: [AuthGuard] }
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
    ViewTicketComponent,
    SettingsLabelsComponent,
    AddLabelComponent,
    SettingsBoardsComponent,
    EditBoardComponent,
    BoardComponent,
    BoardColumnComponent,
    BoardTicketComponent,
    BoardCardComponent,
    FinishedPercentageComponent,
    TeamCardComponent,
    TicketPriorityComponent,
    AddTicketComponent,
    CommentComponent,
    CommentSectionComponent,
    TimerComponent,
    StatisticsComponent,
    ViewWeekComponent,
    VerticalViewComponent,
    SingleViewWeekComponent,
    EditLabelComponent
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
    DragDropModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatCheckboxModule,
    ChartsModule,
    MatProgressBarModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }),
    CommonModule
  ],
  providers: [ThemeService],
  bootstrap: [AppComponent],
  entryComponents: [
    AddBoardComponent,
    AddTeamComponent,
    ConfirmationDialogComponent,
    AddLabelComponent,
    AddTicketComponent,
    EditLabelComponent
  ]
})
export class AppModule { }
