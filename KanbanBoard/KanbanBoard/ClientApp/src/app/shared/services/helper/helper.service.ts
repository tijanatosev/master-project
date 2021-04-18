import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BaseService } from "../base-service.service";

@Injectable({
  providedIn: 'root'
})
export class HelperService extends BaseService{

  constructor(private http: HttpClient) {
    super();
  }
}
