import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { BoardService } from "../../shared/services/board/board.service";
import { Board } from "../../shared/services/board/board.model";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { TeamService } from "../../shared/services/team/team.service";
import { Team } from "../../shared/services/team/team.model";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "../../shared/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-settings-boards',
  templateUrl: './settings-boards.component.html',
  styleUrls: ['./settings-boards.component.css']
})
export class SettingsBoardsComponent implements OnInit, AfterViewInit {
  private teams: Team[] = [];
  public deleteDialogRef: MatDialogRef<any>;
  @ViewChild(MatPaginator, {static: true}) !paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) !sort: MatSort = new MatSort();
  public displayedColumns: string[] = [ 'Id', 'Name', 'Admin', 'Team', 'Actions'];
  public dataSource: MatTableDataSource<Board>;

  @Output() editBoard = new EventEmitter<Board>();

  constructor(private boardService: BoardService,
              private teamService: TeamService,
              private confirmDialog: MatDialog) { }

  ngOnInit() {
    this.teamService.getTeams().subscribe(teams => this.teams = teams);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.loadBoards();
  }

  public getTeamName(element) {
    if (element.TeamId == undefined)
      return '';
    return this.teams.filter(x => x.Id == element.TeamId)[0].Name;
  }

  public openDeleteDialog(id, name) {
    this.deleteDialogRef = this.confirmDialog.open(ConfirmationDialogComponent);
    this.deleteDialogRef.componentInstance.message = "Are you sure you want to permanently delete board " + name + "?";
    this.deleteDialogRef.componentInstance.confirmText = "Yes";
    this.deleteDialogRef.componentInstance.cancelText = "No";

    this.deleteDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.boardService.deleteBoard(id).subscribe(() => this.loadBoards())
      }
    });
  }

  public edit(board) {
    this.editBoard.emit(board);
  }

  private loadBoards() {
    this.boardService.getBoards().subscribe(boards => {
      this.dataSource = new MatTableDataSource<Board>(boards);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
