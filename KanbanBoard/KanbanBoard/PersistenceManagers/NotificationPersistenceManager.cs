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
    public class NotificationPersistenceManager : INotificationPersistenceManager
    {
        private readonly IDbCommands dbCommands = new DbCommands();

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
            DataTable result = dbCommands.ExecuteSqlQuery(query, new MySqlParameter("@Id", id)).Tables["Result"];

            if (result.Rows.Count != 0)
            {
                return LoadFromDataRow(result.Rows[0]);
            }
            return null;
        }

        public Notification LoadByUserId(int userId)
        {
            string query = @"SELECT * FROM Notifications WHERE UserId=@UserId";
            DataTable result = dbCommands.ExecuteSqlQuery(query, new MySqlParameter("@UserId", userId)).Tables["Result"];

            if (result.Rows.Count != 0)
            {
                return LoadFromDataRow(result.Rows[0]);
            }
            return null;
        }

        public int Add(Notification notification)
        {
            string query = @"INSERT INTO Notifications (OnChange, OnChangeMine, OnComment, OnCommentMine, OnStatusChange, OnStatusChangeMine, UserId)
VALUES (@OnChange, @OnChangeMine, @OnComment, @OnCommentMine, @OnStatusChange, @OnStatusChangeMine, @UserId)";
            DbParameter[] parameters = 
            {
                new MySqlParameter("@OnChange", notification.OnChange),
                new MySqlParameter("@OnChangeMine", notification.OnChangeMine),
                new MySqlParameter("@OnComment", notification.OnComment),
                new MySqlParameter("@OnCommentMine", notification.OnCommentMine),
                new MySqlParameter("@OnStatusChange", notification.OnStatusChange),
                new MySqlParameter("@OnStatusChangeMine", notification.OnStatusChangeMine),
                new MySqlParameter("@UserId", notification.UserId),
                new MySqlParameter("@Id", notification.Id) 
            };
            dbCommands.ExecuteSqlNonQuery(query, parameters);
            return Convert.ToInt32(dbCommands.ExecuteScalar("SELECT LAST_INSERT_ID();"));
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
                new MySqlParameter("@OnChange", notification.OnChange),
                new MySqlParameter("@OnChangeMine", notification.OnChangeMine),
                new MySqlParameter("@OnComment", notification.OnComment),
                new MySqlParameter("@OnCommentMine", notification.OnCommentMine),
                new MySqlParameter("@OnStatusChange", notification.OnStatusChange),
                new MySqlParameter("@OnStatusChangeMine", notification.OnStatusChangeMine),
                new MySqlParameter("@UserId", notification.UserId),
                new MySqlParameter("@Id", notification.Id) 
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