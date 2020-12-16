import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TeamService} from '../services/team/team.service';
import {Team} from '../services/team/team.model';

@Component({
  selector: 'app-add-board',
  templateUrl: './add-board.component.html',
  styleUrls: ['./add-board.component.css']
})
export class AddBoardComponent implements OnInit {
  public boardForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    admin: new FormControl('', Validators.required),
    team: new FormControl('', Validators.required)
  });
  public teams: Team[] = [];

  constructor(private teamService: TeamService) { }

  ngOnInit() {
    this.teamService.getTeams().subscribe(result => this.teams = result);
  }

}
