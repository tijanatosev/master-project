export class Ticket {
  public Id: number;
  public Title: string;
  public Description: string;
  public Creator: string;
  public StoryPoints: number;
  public Status: string;
  public DateCreated: Date;
  public AssignedTo: number;
  public StartDate?: Date;
  public EndDate?: Date;
  public Rank: number;
  public Priority: number;
  public BoardId?: number;
  public ColumnId?: number;
  public CompletedAt?: Date;
}
