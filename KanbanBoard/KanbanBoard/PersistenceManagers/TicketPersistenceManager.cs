using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using KanbanBoard.Helpers;
using KanbanBoard.Models;
using KanbanBoard.PersistenceManagers.Interfaces;
using MySqlConnector;

namespace KanbanBoard.PersistenceManagers
{
    public class TicketPersistenceManager : ITicketPersistenceManager
    {
        private readonly IDbCommands dbCommands = new DbCommands();

        public IEnumerable<Ticket> LoadAll(string whereQuery)
        {
            List<Ticket> tickets = new List<Ticket>();
            DataTable result = dbCommands.ExecuteSqlQuery(BuildSqlQuery(whereQuery)).Tables["Result"];
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
            string sqlQuery = @"SELECT * FROM Tickets WHERE Id=@Id";
            DataTable result = dbCommands.ExecuteSqlQuery(sqlQuery, new MySqlParameter("@Id", id)).Tables["Result"];
            
            if (result.Rows.Count != 0)
            {
                return LoadFromDataRow(result.Rows[0]);
            }
            return null;
        }

        public int Add(Ticket ticket)
        {
            string query = @"INSERT INTO Tickets (Title, Description, Creator, StoryPoints, Status, DateCreated, AssignedTo, StartDate, EndDate, ColumnRank, Priority, ColumnId, BoardId) 
VALUES (@Title, @Description, @Creator, @StoryPoints, @Status, @DateCreated, @AssignedTo, @StartDate, @EndDate, @ColumnRank, @Priority, @ColumnId, @BoardId)";
            DbParameter[] parameters = 
            {
                new MySqlParameter("@Title", ticket.Title),
                new MySqlParameter("@Description", ticket.Description),
                new MySqlParameter("@Creator", ticket.Creator),
                new MySqlParameter("@StoryPoints", ticket.StoryPoints),
                new MySqlParameter("@Status", ticket.Status),
                new MySqlParameter("@DateCreated", ticket.DateCreated),
                new MySqlParameter("@AssignedTo", ticket.AssignedTo), 
                new MySqlParameter("@StartDate", ticket.StartDate),
                new MySqlParameter("@EndDate", ticket.EndDate),
                new MySqlParameter("@ColumnRank", ticket.Rank),
                new MySqlParameter("@Priority", ticket.Priority), 
                new MySqlParameter("@ColumnId", ticket.ColumnId),
                new MySqlParameter("@BoardId", ticket.BoardId)
            };
            dbCommands.ExecuteSqlNonQuery(query, parameters);
            return Convert.ToInt32(dbCommands.ExecuteScalar("SELECT LAST_INSERT_ID();"));
        }

        public void Delete(int id)
        {
            string queryTicketsDependencies = @"DELETE FROM TicketsDependencies WHERE TicketId=@TicketId";
            string queryCommentsTickets = @"DELETE FROM CommentsTickets WHERE TicketId=@TicketId";
            string queryTickets = @"DELETE FROM Tickets WHERE Id=@Id";
            dbCommands.ExecuteSqlNonQuery(queryTicketsDependencies, new MySqlParameter("@TicketId", id));
            dbCommands.ExecuteSqlNonQuery(queryCommentsTickets, new MySqlParameter("@TicketId", id));
            dbCommands.ExecuteSqlNonQuery(queryTickets, new MySqlParameter("@Id", id));
        }

        public IEnumerable<Ticket> LoadByUserId(int userId)
        {
            List<Ticket> tickets = new List<Ticket>();
            string sqlQuery = @"SELECT * FROM Tickets WHERE AssignedTo=@AssignedTo";
            DataTable result = dbCommands.ExecuteSqlQuery(sqlQuery, new MySqlParameter("@AssignedTo", userId)).Tables["Result"];
            
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
            string sqlQuery = @"SELECT t.Id, t.Title, t.Description, t.Creator, t.StoryPoints, t.Status, t.DateCreated, t.AssignedTo, t.StartDate, t.EndDate, t.ColumnRank, t.Priority, t.BoardId, t.ColumnId, t.CompletedAt 
FROM Tickets t JOIN Users u on t.AssignedTo=u.Id
JOIN UsersTeams ut ON ut.UserId=u.Id
JOIN Boards b ON b.Id=t.BoardId
WHERE ut.TeamId=@TeamId AND b.TeamId=@TeamId";
            DataTable result = dbCommands.ExecuteSqlQuery(sqlQuery, new MySqlParameter("@TeamId", teamId)).Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    tickets.Add(LoadFromDataRow(row));
                }
            }
            return tickets;
        }
        
        public IEnumerable<Ticket> LoadByBoardId(int boardId)
        {
            List<Ticket> tickets = new List<Ticket>();
            string sqlQuery = @"SELECT t.Id, t.Title, t.Description, t.Creator, t.StoryPoints, t.Status, t.DateCreated, t.AssignedTo, t.StartDate, t.EndDate, t.ColumnRank, t.Priority, t.BoardId, t.ColumnId, t.CompletedAt 
FROM Tickets t JOIN Boards b ON b.Id=t.BoardId
WHERE t.BoardId=@BoardId";
            DataTable result = dbCommands.ExecuteSqlQuery(sqlQuery, new MySqlParameter("@BoardId", boardId)).Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    tickets.Add(LoadFromDataRow(row));
                }
            }
            return tickets;
        }

        public IEnumerable<Ticket> LoadByColumnId(int columnId, string whereQuery)
        {
            List<Ticket> tickets = new List<Ticket>();
            DataTable result = dbCommands.ExecuteSqlQuery(BuildSqlQueryColumn(whereQuery), new MySqlParameter("@ColumnId", columnId)).Tables["Result"];
            
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    tickets.Add(LoadFromDataRow(row));
                }
            }
            return tickets;
        }

        public int UpdateColumn(int id, Column column, bool removeFromDone)
        {
            string sqlQuery = @"UPDATE Tickets
SET ColumnId=@ColumnId,
Status=@Status
WHERE Id=@Id";
            if (removeFromDone)
            {
                string queryCompletedAt = @"UPDATE Tickets
SET CompletedAt=@CompletedAt
WHERE Id=@Id";
                dbCommands.ExecuteSqlNonQuery(queryCompletedAt, new MySqlParameter("@CompletedAt", DBNull.Value), new MySqlParameter("@Id", id));
            } 
            else if (column.IsDone)
            {
                string queryCompletedAt = @"UPDATE Tickets
SET CompletedAt=@CompletedAt
WHERE Id=@Id";
                dbCommands.ExecuteSqlNonQuery(queryCompletedAt, new MySqlParameter("@CompletedAt", DateTime.Now.Date), new MySqlParameter("@Id", id));
            }
            return dbCommands.ExecuteSqlNonQuery(sqlQuery, new MySqlParameter("@ColumnId", column.Id), new MySqlParameter("@Status", column.Name), new MySqlParameter("@Id", id));
        }

        public int UpdateRank(int id, int rank)
        {
            string sqlQuery = @"UPDATE Tickets
SET ColumnRank=@ColumnRank
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(sqlQuery, new MySqlParameter("@ColumnRank", rank), new MySqlParameter("@Id", id));
        }

        public int UpdateAssignedTo(int id, int userId)
        {
            string sqlQuery = @"UPDATE Tickets
SET AssignedTo=@AssignedTo
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(sqlQuery, new MySqlParameter("@AssignedTo", userId), new MySqlParameter("@Id", id));
        }

        public int UpdateStartDate(int id, DateTime startDate)
        {
            string sqlQuery = @"UPDATE Tickets
SET StartDate=@StartDate
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(sqlQuery, new MySqlParameter("@StartDate", startDate), new MySqlParameter("@Id", id));
        }

        public int UpdateEndDate(int id, DateTime endDate)
        {
            string sqlQuery = @"UPDATE Tickets
SET EndDate=@EndDate
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(sqlQuery, new MySqlParameter("@EndDate", endDate), new MySqlParameter("@Id", id));
        }

        public int UpdateStoryPoints(int id, int storyPoints)
        {
            string sqlQuery = @"UPDATE Tickets
SET StoryPoints=@StoryPoints
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(sqlQuery, new MySqlParameter("@StoryPoints", storyPoints), new MySqlParameter("@Id", id));
        }

        public int UpdateTitle(int id, string title)
        {
            string sqlQuery = @"UPDATE Tickets
SET Title=@Title
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(sqlQuery, new MySqlParameter("@Title", title), new MySqlParameter("@Id", id));
        }

        public int UpdateDescription(int id, string description)
        {
            string sqlQuery = @"UPDATE Tickets
SET Description=@Description
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(sqlQuery, new MySqlParameter("@Description", description), new MySqlParameter("@Id", id));
        }

        public IEnumerable<Ticket> LoadFavoritesByUserId(int userId)
        {
            List<Ticket> tickets = new List<Ticket>();
            string sqlQuery = @"SELECT t.Id, t.Title, t.Description, t.Creator, t.StoryPoints, t.Status, t.DateCreated, t.AssignedTo, t.StartDate, t.EndDate, t.ColumnRank, t.Priority, t.BoardId, t.ColumnId, t.CompletedAt
FROM Tickets t JOIN Favorites f ON t.Id = f.TicketId
WHERE f.UserId=@UserId";
            DataTable result = dbCommands.ExecuteSqlQuery(sqlQuery, new MySqlParameter("@UserId", userId)).Tables["Result"];
            
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    tickets.Add(LoadFromDataRow(row));
                }
            }
            return tickets;
        }
        
        public int UpdatePriority(int id, int priority)
        {
            string sqlQuery = @"UPDATE Tickets
SET Priority=@Priority
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(sqlQuery, new MySqlParameter("@Priority", priority), new MySqlParameter("@Id", id));
        }
        
        public int GetRankForColumn(int columnId, int boardId)
        {
            string sqlQuery = "SELECT MAX(ColumnRank) FROM Tickets WHERE ColumnId=@ColumnId and BoardId=@BoardId";
            DataTable result = dbCommands.ExecuteSqlQuery(sqlQuery, new MySqlParameter("@ColumnId", columnId), new MySqlParameter("@BoardId", boardId)).Tables["Result"];
            if (result.Rows.Count != 0)
            {
                return result.Rows[0][0].ToString() == "" ? 0 : Convert.ToInt32(result.Rows[0][0]);
            }

            return -1;
        }

        public IEnumerable<Ticket> GetDependency(int id)
        {
            List<Ticket> tickets = new List<Ticket>();
            DataTable result = dbCommands.ExecuteSqlQuery(@"SELECT t.Id, t.Title, t.Description, t.Creator, t.StoryPoints, t.Status, t.DateCreated, t.AssignedTo, t.StartDate, t.EndDate, t.ColumnRank, t.Priority, t.BoardId, t.ColumnId, t.CompletedAt 
FROM Tickets t JOIN TicketsDependencies td ON t.Id=td.DependencyId 
WHERE td.TicketId=@TicketId", new MySqlParameter("@TicketId", id)).Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    tickets.Add(LoadFromDataRow(row));
                }
            }
            return tickets;
        }

        public int AddDependency(int id, int dependencyId)
        {
            string sqlQuery = @"INSERT INTO TicketsDependencies (TicketId, DependencyId)
VALUES (@TicketId, @DependencyId)";
            dbCommands.ExecuteSqlNonQuery(sqlQuery, new MySqlParameter("@TicketId", id), new MySqlParameter("@DependencyId", dependencyId));
            return Convert.ToInt32(dbCommands.ExecuteScalar("SELECT LAST_INSERT_ID();"));
        }

        public void DeleteDependency(int id, int dependencyId)
        {
            string sqlQuery = @"DELETE FROM TicketsDependencies WHERE TicketId=@TicketId AND DependencyId=@DependencyId";
            dbCommands.ExecuteSqlNonQuery(sqlQuery, new MySqlParameter("@TicketId", id), new MySqlParameter("@DependencyId", dependencyId));
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
                StartDate = row["StartDate"] != DBNull.Value ? Convert.ToDateTime(row["StartDate"]).Date : (DateTime?) null,
                EndDate = row["EndDate"] != DBNull.Value ? Convert.ToDateTime(row["EndDate"]).Date : (DateTime?) null,
                Rank = Convert.ToInt32(row["ColumnRank"]),
                Priority = Convert.ToInt32(row["Priority"]),
                BoardId = Convert.ToInt32(row["BoardId"]),
                ColumnId = Convert.ToInt32(row["ColumnId"]),
                CompletedAt = row["CompletedAt"] != DBNull.Value ? Convert.ToDateTime(row["CompletedAt"]).Date : (DateTime?) null
            };
        }

        private string BuildSqlQuery(string whereQuery)
        {
            string baseSql = "SELECT * FROM Tickets";
            if (whereQuery == " ")
            {
                return baseSql;
            }
            
            return baseSql + " WHERE " + whereQuery;
        }

        private string BuildSqlQueryColumn(string whereQuery)
        {
            if (whereQuery != "")
            {
                if (whereQuery.Contains("LabelId"))
                {
                    return @"SELECT t.Id, t.Title, t.Description, t.Creator, t.StoryPoints, t.Status, t.DateCreated, t.AssignedTo, t.StartDate, t.EndDate, t.ColumnRank, t.Priority, t.BoardId, t.ColumnId, t.CompletedAt
FROM Tickets t JOIN LabelsTickets l ON t.Id = l.TicketId 
WHERE ColumnId=@ColumnId and " + whereQuery + " ORDER BY ColumnRank ASC";
                }
                return @"SELECT * FROM Tickets WHERE ColumnId=@ColumnId and " + whereQuery + " ORDER BY ColumnRank ASC";
            }

            return @"SELECT * FROM Tickets WHERE ColumnId=@ColumnId ORDER BY ColumnRank ASC";
        }
    }
}