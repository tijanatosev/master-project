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
    public class LabelPersistenceManager : ILabelPersistenceManager
    {
        private readonly IDbCommands dbCommands = new DbCommands();

        public IEnumerable<Label> LoadAll()
        {
            List<Label> labels = new List<Label>();
            DataTable result = dbCommands.ExecuteSqlQuery("SELECT * FROM Labels").Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    labels.Add(LoadFromDataRow(row));
                }
            }
            return labels;
        }

        public Label Load(int id)
        {
            string sqlQuery = @"SELECT * FROM Labels WHERE Id=@Id";
            DataTable result = dbCommands.ExecuteSqlQuery(sqlQuery, new MySqlParameter("@Id", id)).Tables["Result"];

            if (result.Rows.Count != 0)
            {
                return LoadFromDataRow(result.Rows[0]);
            }
            return null;
        }

        public int Add(Label label)
        {
            string query = @"INSERT INTO Labels (Name, Color) VALUES (@Name, @Color)";
            DbParameter[] parameters = 
            {
                new MySqlParameter("@Name", label.Name),
                new MySqlParameter("@Color", label.Color)
            };
            dbCommands.ExecuteSqlNonQuery(query, parameters);
            return Convert.ToInt32(dbCommands.ExecuteScalar("SELECT LAST_INSERT_ID();"));
        }

        public int Update(int id, Label label)
        {
            string query = @"UPDATE Labels
SET Name=@Name,
Color=@Color
WHERE Id=@Id";
            DbParameter[] parameters = 
            {
                new MySqlParameter("@Name", label.Name),
                new MySqlParameter("@Color", label.Color),
                new MySqlParameter("@Id", id) 
            };
            return dbCommands.ExecuteSqlNonQuery(query, parameters);
        }

        public void Delete(int id)
        {
            string queryLabelsTickets = @"DELETE FROM LabelsTickets WHERE LabelId=@LabelId";
            string queryLabels = @"DELETE FROM Labels WHERE Id=@Id";
            dbCommands.ExecuteSqlNonQuery(queryLabelsTickets, new MySqlParameter("@LabelId", id));
            dbCommands.ExecuteSqlNonQuery(queryLabels, new MySqlParameter("@Id", id));
        }

        public void DeleteAll()
        {
            string queryLabelsTickets = @"DELETE FROM LabelsTickets";
            string queryLabels = @"DELETE FROM Labels";
            dbCommands.ExecuteSqlNonQuery(queryLabelsTickets);
            dbCommands.ExecuteSqlNonQuery(queryLabels);
        }

        public IEnumerable<Label> LoadByTicketId(int ticketId)
        {
            List<Label> labels = new List<Label>();
            string query = @"SELECT l.Id, l.Name, l.Color
FROM Labels l join LabelsTickets lt ON l.Id=lt.LabelId
WHERE lt.TicketId=@TicketId";
            DataTable result = dbCommands.ExecuteSqlQuery(query,new MySqlParameter("@TicketId", ticketId)).Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    labels.Add(LoadFromDataRow(row));
                }
            }
            return labels;
        }

        public void DeleteByTicketId(int labelId, int ticketId)
        {
            string query = @"DELETE FROM LabelsTickets WHERE LabelId=@LabelId AND TicketId=@TicketId";
            dbCommands.ExecuteSqlNonQuery(query, new MySqlParameter("@LabelId", labelId), new MySqlParameter("@TicketId", ticketId));
        }

        public int AddByTicketId(Label label, int ticketId)
        {
            string query = @"INSERT INTO LabelsTickets (LabelId, TicketId) VALUES (@LabelId, @TicketId)";
            DbParameter[] parameters = 
            {
                new MySqlParameter("@LabelId", label.Id),
                new MySqlParameter("@TicketId", ticketId)
            };
            dbCommands.ExecuteSqlNonQuery(query, parameters);
            return Convert.ToInt32(dbCommands.ExecuteScalar("SELECT LAST_INSERT_ID();"));
        }

        public IEnumerable<Label> LoadByBoardId(int boardId)
        {
            List<Label> labels = new List<Label>();
            string query = @"SELECT l.Id, l.Name, l.Color
FROM Tickets t JOIN LabelsTickets lt ON t.Id=lt.TicketId JOIN Labels l ON l.Id=lt.LabelId
WHERE t.BoardId=@BoardId
GROUP BY l.Name, l.Id, l.Color";
            DataTable result = dbCommands.ExecuteSqlQuery(query,new MySqlParameter("@BoardId", boardId)).Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    labels.Add(LoadFromDataRow(row));
                }
            }
            return labels;
        }

        public Label LoadFromDataRow(DataRow row)
        {
            return new Label
            {
                Id = Convert.ToInt32(row["Id"]),
                Name = row["Name"].ToString(),
                Color = row["Color"].ToString()
            };
        }
    }
}