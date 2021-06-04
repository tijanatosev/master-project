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
    public class NotificationPersistenceManager : INotificationPersistenceManager
    {
        private string serverName = "W-PF1EP858\\SQLEXPRESS";
        private string dbName = "KanbanBoard";
        private IDbCommands dbCommands;

        public NotificationPersistenceManager()
        {
            dbCommands = new DbCommands(serverName, dbName);
        }

        public IEnumerable<Notification> LoadAll()
        {
            List<Notification> notifications = new List<Notification>();
            DataTable result = dbCommands.ExecuteSqlQuery("SELECT * FROM Notifications").Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    notifications.Add(LoadFromDataRow(row));
                }
            }
            return notifications;
        }

        public Notification Load(int id)
        {
            string query = @"SELECT * FROM Notifications WHERE Id=@Id";
            DataTable result = dbCommands.ExecuteSqlQuery(query, new SqlParameter("@Id", id)).Tables["Result"];

            if (result.Rows.Count != 0)
            {
                return LoadFromDataRow(result.Rows[0]);
            }
            return null;
        }

        public Notification LoadByUserId(int userId)
        {
            string query = @"SELECT * FROM Notifications WHERE UserId=@UserId";
            DataTable result = dbCommands.ExecuteSqlQuery(query, new SqlParameter("@UserId", userId)).Tables["Result"];

            if (result.Rows.Count != 0)
            {
                return LoadFromDataRow(result.Rows[0]);
            }
            return null;
        }

        public int Add(Notification notification)
        {
            string query = @"INSERT INTO Notifications (OnChange, OnChangeMine, OnComment, OnCommentMine, OnStatusChange, OnStatusChangeMine, UserId)
OUTPUT INSERTED.ID
VALUES (@OnChange, @OnChangeMine, @OnComment, @OnCommentMine, @OnStatusChange, @OnStatusChangeMine, @UserId)";
            DbParameter[] parameters = 
            {
                new SqlParameter("@OnChange", notification.OnChange),
                new SqlParameter("@OnChangeMine", notification.OnChangeMine),
                new SqlParameter("@OnComment", notification.OnComment),
                new SqlParameter("@OnCommentMine", notification.OnCommentMine),
                new SqlParameter("@OnStatusChange", notification.OnStatusChange),
                new SqlParameter("@OnStatusChangeMine", notification.OnStatusChangeMine),
                new SqlParameter("@UserId", notification.UserId),
                new SqlParameter("@Id", notification.Id) 
            };
            return dbCommands.ExecuteScalar(query, parameters);
        }

        public int Update(Notification notification)
        {
            string query = @"UPDATE Notifications
SET OnChange=@OnChange,
OnChangeMine=@OnChangeMine,
OnComment=@OnComment,
OnCommentMine=@OnCommentMine,
OnStatusChange=@OnStatusChange,
OnStatusChangeMine=@OnStatusChangeMine,
UserId=@UserId
WHERE Id=@Id";
            DbParameter[] parameters = 
            {
                new SqlParameter("@OnChange", notification.OnChange),
                new SqlParameter("@OnChangeMine", notification.OnChangeMine),
                new SqlParameter("@OnComment", notification.OnComment),
                new SqlParameter("@OnCommentMine", notification.OnCommentMine),
                new SqlParameter("@OnStatusChange", notification.OnStatusChange),
                new SqlParameter("@OnStatusChangeMine", notification.OnStatusChangeMine),
                new SqlParameter("@UserId", notification.UserId),
                new SqlParameter("@Id", notification.Id) 
            };
            return dbCommands.ExecuteSqlNonQuery(query, parameters);
        }

        public Notification LoadFromDataRow(DataRow row)
        {
            return new Notification
            {
                Id = Convert.ToInt32(row["Id"]),
                OnChange = Convert.ToBoolean(row["OnChange"]),
                OnChangeMine = Convert.ToBoolean(row["OnChangeMine"]),
                OnComment = Convert.ToBoolean(row["OnComment"]),
                OnCommentMine = Convert.ToBoolean(row["OnCommentMine"]),
                OnStatusChange = Convert.ToBoolean(row["OnStatusChange"]),
                OnStatusChangeMine = Convert.ToBoolean(row["OnStatusChangeMine"]),
                UserId = Convert.ToInt32(row["UserId"])
            };
        }
    }
}