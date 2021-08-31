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
    public class CommentPersistenceManager : ICommentPersistenceManager
    {
        private readonly IDbCommands dbCommands;

        public CommentPersistenceManager(ConnectionStringConfiguration connectionStringConfiguration)
        {
            dbCommands = new DbCommands(connectionStringConfiguration);
        }

        public IEnumerable<Comment> LoadByTicketId(int ticketId)
        {
            List<Comment> comments = new List<Comment>();
            string query = @"SELECT Id, CommentedAt, Text, UserId, TicketId 
FROM Comments 
WHERE TicketId = @TicketId";
            DataTable result = dbCommands.ExecuteSqlQuery(query, new MySqlParameter("@TicketId", ticketId)).Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    comments.Add(LoadFromDataRow(row));
                }
            }
            return comments;
        }

        public int Add(Comment comment, int ticketId)
        {
            string query = @"INSERT INTO Comments (CommentedAt, Text, UserId, TicketId)
VALUES (@CommentedAt, @Text, @UserId, @TicketId)";
            DbParameter[] parameters = 
            {
                new MySqlParameter("@CommentedAt", comment.CommentedAt),
                new MySqlParameter("@Text", comment.Text),
                new MySqlParameter("@UserId", comment.UserId),
                new MySqlParameter("@TicketId", comment.TicketId) 
            };
            return dbCommands.ExecuteScalarReturnInsertId(query, parameters);
        }

        public int Update(int id, string text)
        {
            string query = @"UPDATE Comments
SET Text=@Text
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(query, new MySqlParameter("@Text", text), new MySqlParameter("@Id", id));
        }

        public void Delete(int commentId)
        {
            string query = @"DELETE FROM Comments WHERE Id = @Id";
            dbCommands.ExecuteSqlNonQuery(query, new MySqlParameter("@Id", commentId));
        }

        public Comment LoadFromDataRow(DataRow row)
        {
            return new Comment
            {
                Id = Convert.ToInt32(row["Id"]),
                CommentedAt = Convert.ToDateTime(row["CommentedAt"]),
                Text = row["Text"].ToString(),
                UserId = Convert.ToInt32(row["UserId"]),
                TicketId = Convert.ToInt32(row["TicketId"])
            };
        }
    }
}