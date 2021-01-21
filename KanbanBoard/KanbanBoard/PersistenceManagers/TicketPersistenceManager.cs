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
            string query = @"INSERT INTO Users (Title, Description, Creator, StoryPoints, Status, DateCreated, AssignedTo) 
OUTPUT INSERTED.ID
VALUES (@Title, @Description, @Creator, @StoryPoints, @Status, @DateCreated, @AssignedTo)";
            DbParameter[] parameters = 
            {
                new SqlParameter("@Title", ticket.Title),
                new SqlParameter("@Description", ticket.Description),
                new SqlParameter("@Creator", ticket.Creator),
                new SqlParameter("@StoryPoints", ticket.StoryPoints),
                new SqlParameter("@Status", ticket.Status),
                new SqlParameter("@DateCreated", ticket.DateCreated),
                new SqlParameter("@AssignedTo", ticket.AssignedTo) 
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
            string query = @"SELECT t.Id, t.Title, t.Description, t.Creator, t.StoryPoints, t.Status, t.DateCreated, t.AssignedTo, t.BoardId, t.ColumnId 
FROM Tickets t JOIN Users u on t.AssignedTo=u.Id
JOIN UsersTeams ut ON ut.UserId=u.Id
WHERE ut.TeamId=@TeamId";
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
                DateCreated = Convert.ToDateTime(row["DateCreated"]),
                AssignedTo = Convert.ToInt32(row["AssignedTo"]),
                BoardId = row["BoardId"] as int?,
                ColumnId = row["ColumnId"] as int?
            };
        }
    }
}