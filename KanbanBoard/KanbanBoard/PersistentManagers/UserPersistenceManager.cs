using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using KanbanBoard.Helpers;

namespace KanbanBoard.Models
{
    public class UserPersistenceManager : IUserPersistenceManager
    {
        private string serverName = "W-PF1EP858\\SQLEXPRESS";
        private string dbName = "KanbanBoard";
        private IDbCommands dbCommands;

        public UserPersistenceManager()
        {
            dbCommands = new DbCommands(serverName, dbName);
        }

        public IEnumerable<User> GetUsers()
        {
            List<User> users = new List<User>();
            DataSet result = dbCommands.ExecuteSqlQuery("select * from Users");
            foreach (DataRow row in result.Tables["Result"].Rows)
            {
                users.Add(LoadFromDataRow(row));
            }
            return users;
        }

        public User LoadFromDataRow(DataRow row)
        {
            User user = new User();
            user.ID = Convert.ToInt32(row["Id"]);
            user.Username = row["Username"].ToString();
            user.Password = row["Password"].ToString();
            user.FirstName = row["FirstName"].ToString();
            user.LastName = row["LastName"].ToString();
            user.Email = row["Email"].ToString();
            user.UserType = row["UserType"].ToString();
            user.TeamId = row["TeamId"] as int?;
            return user;
        }
    }
}