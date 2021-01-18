export class Ticket {
  public Id: number;
  public Title: string;
  public Description: string;
  public Creator: string;
  public StoryPoints: string;
  public Status: string;
  public DateCreated: string;
  public AssignedTo: number;
  public BoardId?: number;
  public ColumnId?: number;
}
