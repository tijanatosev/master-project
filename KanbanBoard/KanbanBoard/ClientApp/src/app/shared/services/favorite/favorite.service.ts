import { Injectable } from '@angular/core';
import { BaseService } from "../base-service.service";
import { HttpClient } from "@angular/common/http";
import { Favorite } from './favorite.model';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FavoriteService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  public getFavoritesByUserId(userId): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.favoritesUrl()}/${userId}`);
  }

  public isFavorite(ticketId, userId) {
    return this.http.get<boolean>(`${this.favoritesUrl()}/${ticketId}/user/${userId}`);
  }

  public addFavorite(favorite) {
    return this.http.post(`${this.favoritesUrl()}`, favorite, { observe: "response" })
      .pipe(map(response => response.body));
  }

  public deleteFavorite(ticketId, userId) {
    return this.http.delete(`${this.favoritesUrl()}/${ticketId}/user/${userId}`);
  }
}
