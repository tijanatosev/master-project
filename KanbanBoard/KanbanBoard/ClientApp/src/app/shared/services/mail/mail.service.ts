import { Injectable } from '@angular/core';
import { BaseService } from "../base-service.service";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MailService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  public sendMail(mail) {
    return this.http.post(`${this.helpersUrl()}/mail`, mail, { observe: "response" })
      .pipe(map(response => response.body));
  }

}
