using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using KanbanBoard.Helpers;
using KanbanBoard.Models;
using KanbanBoard.PersistenceManagers.Interfaces;

namespace KanbanBoard.PersistenceManagers
{
    public class TicketPersistenceManager : ITicketPersistenceManager
    {
        private string serverName = "W-PF1EP858\\SQLEXPRESS";
        private string dbName = "KanbanBoard";
        private IDbCommands dbCommands;

        public TicketPersistenceManager()
        {
            dbCommands = new DbCommands(serverName, dbName);
        }

        public IEnumerable<Ticket> LoadAll()
        {
            List<Ticket> tickets = new List<Ticket>();
            DataTable result = dbCommands.ExecuteSqlQuery("SELECT * FROM Tickets").Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    tickets.Add(LoadFromDataRow(row));
                }
            }
            return tickets;
        }

        public Ticket Load(int id)
        {
            string query = @"SELECT * FROM Tickets WHERE Id=@Id";
            DataTable result = dbCommands.ExecuteSqlQuery(query, new SqlParameter("@Id", id)).Tables["Result"];
            
            if (result.Rows.Count != 0)
            {
                return LoadFromDataRow(result.Rows[0]);
            }
            return null;
        }

        public int Add(Ticket ticket)
        {
            string query = @"INSERT INTO Tickets (Title, Description, Creator, StoryPoints, Status, DateCreated, AssignedTo, StartDate, EndDate, Rank) 
OUTPUT INSERTED.ID
VALUES (@Title, @Description, @Creator, @StoryPoints, @Status, @DateCreated, @AssignedTo, @StartDate, @EndDate, @Rank)";
            DbParameter[] parameters = 
            {
                new SqlParameter("@Title", ticket.Title),
                new SqlParameter("@Description", ticket.Description),
                new SqlParameter("@Creator", ticket.Creator),
                new SqlParameter("@StoryPoints", ticket.StoryPoints),
                new SqlParameter("@Status", ticket.Status),
                new SqlParameter("@DateCreated", ticket.DateCreated),
                new SqlParameter("@AssignedTo", ticket.AssignedTo), 
                new SqlParameter("@StartDate", ticket.StartDate),
                new SqlParameter("@EndDate", ticket.EndDate),
                new SqlParameter("@Rank", ticket.Rank) 
            };
            return dbCommands.ExecuteScalar(query, parameters);
        }

        public void Delete(int id)
        {
            string query = @"DELETE FROM Tickets WHERE Id=@Id";
            dbCommands.ExecuteSqlNonQuery(query, new SqlParameter("@Id", id));
        }

        public IEnumerable<Ticket> LoadByUserId(int userId)
        {
            List<Ticket> tickets = new List<Ticket>();
            string query = @"SELECT * FROM Tickets WHERE AssignedTo=@AssignedTo";
            DataTable result = dbCommands.ExecuteSqlQuery(query, new SqlParameter("@AssignedTo", userId)).Tables["Result"];
            
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    tickets.Add(LoadFromDataRow(row));
                }
            }
            return tickets;
        }

        public IEnumerable<Ticket> LoadByTeamId(int teamId)
        {
            List<Ticket> tickets = new List<Ticket>();
            string query = @"SELECT t.Id, t.Title, t.Description, t.Creator, t.StoryPoints, t.Status, t.DateCreated, t.AssignedTo, t.StartDate, t.EndDate, t.Rank, t.BoardId, t.ColumnId 
FROM Tickets t JOIN Users u on t.AssignedTo=u.Id
JOIN UsersTeams ut ON ut.UserId=u.Id
JOIN Boards b ON b.Id=t.BoardId
WHERE ut.TeamId=@TeamId AND b.TeamId=@TeamId";
            DataTable result = dbCommands.ExecuteSqlQuery(query, new SqlParameter("@TeamId", teamId)).Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    tickets.Add(LoadFromDataRow(row));
                }
            }
            return tickets;
        }

        public IEnumerable<Ticket> LoadByColumnId(int columnId)
        {
            List<Ticket> tickets = new List<Ticket>();
            string query = @"SELECT * FROM Tickets WHERE ColumnId=@ColumnId";
            DataTable result = dbCommands.ExecuteSqlQuery(query, new SqlParameter("@ColumnId", columnId)).Tables["Result"];
            
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    tickets.Add(LoadFromDataRow(row));
                }
            }
            return tickets;
        }

        public int UpdateColumn(int id, int columnId, string status)
        {
            string query = @"UPDATE Tickets
SET ColumnId=@ColumnId,
Status=@Status
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(query, new SqlParameter("@ColumnId", columnId), new SqlParameter("@Status", status), new SqlParameter("@Id", id));
        }

        public int UpdateRank(int id, int rank)
        {
            string query = @"UPDATE Tickets
SET Rank=@Rank
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(query, new SqlParameter("@Rank", rank), new SqlParameter("@Id", id));
        }

        public int UpdateAssignedTo(int id, int userId)
        {
            string query = @"UPDATE Tickets
SET AssignedTo=@AssignedTo
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(query, new SqlParameter("@AssignedTo", userId), new SqlParameter("@Id", id));
        }

        public int UpdateStartDate(int id, DateTime startDate)
        {
            string query = @"UPDATE Tickets
SET StartDate=@StartDate
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(query, new SqlParameter("@StartDate", startDate), new SqlParameter("@Id", id));
        }

        public int UpdateEndDate(int id, DateTime endDate)
        {
            string query = @"UPDATE Tickets
SET EndDate=@EndDate
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(query, new SqlParameter("@EndDate", endDate), new SqlParameter("@Id", id));
        }

        public int UpdateStoryPoints(int id, int storyPoints)
        {
            string query = @"UPDATE Tickets
SET StoryPoints=@StoryPoints
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(query, new SqlParameter("@StoryPoints", storyPoints), new SqlParameter("@Id", id));
        }

        public int UpdateTitle(int id, string title)
        {
            string query = @"UPDATE Tickets
SET Title=@Title
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(query, new SqlParameter("@Title", title), new SqlParameter("@Id", id));
        }

        public int UpdateDescription(int id, string description)
        {
            string query = @"UPDATE Tickets
SET Description=@Description
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(query, new SqlParameter("@Description", description), new SqlParameter("@Id", id));
        }

        public Ticket LoadFromDataRow(DataRow row)
        {
            return new Ticket
            {
                Id = Convert.ToInt32(row["Id"]),
                Title = row["Title"].ToString(),
                Description = row["Description"].ToString(),
                Creator = row["Creator"].ToString(),
                StoryPoints = Convert.ToInt32(row["StoryPoints"]),
                Status = row["Status"].ToString(),
                DateCreated = Convert.ToDateTime(row["DateCreated"]).Date,
                AssignedTo = Convert.ToInt32(row["AssignedTo"]),
                StartDate = Convert.ToDateTime(row["StartDate"]).Date,
                EndDate = Convert.ToDateTime(row["EndDate"]).Date,
                Rank = Convert.ToInt32(row["Rank"]),
                BoardId = Convert.ToInt32(row["BoardId"]),
                ColumnId = Convert.ToInt32(row["ColumnId"])
            };
        }
    }
}