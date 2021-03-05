export class BaseService {
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

  public ticketsUrl() {
    return this.url + 'tickets';
  }

  public notificationsUrl() {
    return this.url + 'notifications';
  }

  public labelsUrl() {
    return this.url + 'labels';
  }
}
