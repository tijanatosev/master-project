import { HttpHeaders } from '@angular/common/http';

export class Service {
  private url = 'https://localhost:5001/api/';

  public usersUrl() {
    return this.url + 'users';
  }

  public boardsUrl() {
    return this.url + 'boards';
  }

  public teamsUrl() {
    return this.url + 'teams';
  }

  public httpHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }
}
