import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  public isExpanded: boolean = false;
  public isLoggedIn: Observable<boolean>;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn;
  }

  public logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
