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
    public class CommentPersistenceManager : ICommentPersistenceManager
    {
        private readonly IDbCommands dbCommands = new DbCommands();

        public IEnumerable<Comment> LoadByTicketId(int ticketId)
        {
            List<Comment> comments = new List<Comment>();
            string query = @"SELECT Id, CommentedAt, Text, UserId 
FROM Comments 
WHERE TicketId = @TicketId";
            DataTable result = dbCommands.ExecuteSqlQuery(query, new SqlParameter("@TicketId", ticketId)).Tables["Result"];
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
OUTPUT INSERTED.ID
VALUES (@CommentedAt, @Text, @UserId, @TicketId)";
            DbParameter[] parameters = 
            {
                new SqlParameter("@CommentedAt", comment.CommentedAt),
                new SqlParameter("@Text", comment.Text),
                new SqlParameter("@UserId", comment.UserId),
                new SqlParameter("@TicketId", comment.TicketId) 
            };
            return dbCommands.ExecuteScalar(query, parameters);
        }

        public int Update(int id, string text)
        {
            string query = @"UPDATE Comments
SET Text=@Text
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(query, new SqlParameter("@Text", text), new SqlParameter("@Id", id));
        }

        public void Delete(int commentId)
        {
            string query = @"DELETE FROM Comments WHERE Id = @Id";
            dbCommands.ExecuteSqlNonQuery(query, new SqlParameter("@Id", commentId));
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