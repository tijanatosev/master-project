import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { Ticket } from "../services/ticket/ticket.model";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { TicketService } from "../services/ticket/ticket.service";

@Component({
  selector: 'app-tickets-datatable',
  templateUrl: './tickets-datatable.component.html',
  styleUrls: ['./tickets-datatable.component.css']
})
export class TicketsDatatableComponent implements OnInit, AfterViewInit {
  @Input() team;
  @Input() user;

  @ViewChild(MatPaginator, {static: true}) !paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) !sort: MatSort = new MatSort();

  public displayedColumns: string[] = ['Id', 'Title', 'Description', 'Creator', 'StoryPoints', 'Status', 'DateCreated', 'AssignedTo', 'Visit'];
  public dataSource: MatTableDataSource<Ticket>;

  constructor(private ticketService: TicketService) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    if (this.user != null) {
      this.ticketService.getTicketsByUserId(this.user).subscribe(tickets => {
        this.dataSource = new MatTableDataSource<Ticket>(tickets);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    } else if (this.team != null) {
      this.ticketService.getTicketsByTeamId(this.team).subscribe(tickets => {
        this.dataSource = new MatTableDataSource<Ticket>(tickets);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }

}
