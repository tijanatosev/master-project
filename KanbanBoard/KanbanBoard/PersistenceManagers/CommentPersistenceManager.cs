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
        private string serverName = "W-PF1EP858\\SQLEXPRESS";
        private string dbName = "KanbanBoard";
        private IDbCommands dbCommands;

        public CommentPersistenceManager()
        {
            dbCommands = new DbCommands(serverName, dbName);
        }

        public IEnumerable<Comment> LoadByTicketId(int ticketId)
        {
            List<Comment> comments = new List<Comment>();
            string query = @"SELECT c.Id, c.CommentedAt, c.Text, c.UserId FROM Comments c JOIN CommentsTickets ct where c.Id = ct.CommentId";
            DataTable result = dbCommands.ExecuteSqlQuery(query).Tables["Result"];
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
            string queryComments = @"INSERT INTO Comments (CommentedAt, Text, UserId)
OUTPUT INSERTED.ID
VALUES (@CommentedAt, @Text, @UserId)";
            DbParameter[] parameters = 
            {
                new SqlParameter("@CommentedAt", comment.CommentedAt),
                new SqlParameter("@Text", comment.Text),
                new SqlParameter("@UserId", comment.UserId),
            };
            int commentId = dbCommands.ExecuteScalar(queryComments, parameters);
            
            string queryCommentsTickets = @"INSERT INTO CommentsTickets (CommentId, TicketId)
VALUES (@CommentId, @TicketId)";
            
            return dbCommands.ExecuteScalar(queryCommentsTickets, new SqlParameter("@CommentId", commentId), new SqlParameter("@TicketId", ticketId));
        }

        public void Delete(int commentId, int ticketId)
        {
            string queryCommentsTickets = @"DELETE FROM CommentsTickets WHERE CommentId = @CommentId AND TicketId = @TicketId";
            string queryComments = @"DELETE FROM Comments WHERE Id = @Id";
            dbCommands.ExecuteSqlNonQuery(queryCommentsTickets, new SqlParameter("@CommentId", commentId), new SqlParameter("@TicketId", ticketId));
            dbCommands.ExecuteSqlNonQuery(queryComments, new SqlParameter("@Id", commentId));
        }

        public Comment LoadFromDataRow(DataRow row)
        {
            return new Comment
            {
                Id = Convert.ToInt32(row["Id"]),
                CommentedAt = Convert.ToDateTime(row["CommentedAt"]).Date,
                Text = row["Text"].ToString(),
                UserId = Convert.ToInt32(row["UserId"])
            };
        }
    }
}