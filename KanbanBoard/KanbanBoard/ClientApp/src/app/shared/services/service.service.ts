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
}
