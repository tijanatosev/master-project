export class Ticket {
  public Id: number;
  public Title: string;
  public Description: string;
  public Creator: string;
  public StoryPoints: string;
  public Status: string;
  public DateCreated: Date;
  public AssignedTo: number;
  public StartDate: Date;
  public EndDate: Date;
  public BoardId?: number;
  public ColumnId?: number;
}
