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

        public IEnumerable<User> LoadAll()
        {
            List<User> users = new List<User>();
            DataTable result = dbCommands.ExecuteSqlQuery("select * from Users").Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    users.Add(LoadFromDataRow(row));
                }
            }
            return users;
        }

        public User LoadFromDataRow(DataRow row)
        {
            return new User
            {
                Id = Convert.ToInt32(row["Id"]),
                Username = row["Username"].ToString(),
                Password = row["Password"].ToString(),
                FirstName = row["FirstName"].ToString(),
                LastName = row["LastName"].ToString(),
                Email = row["Email"].ToString(),
                UserType = row["UserType"].ToString(),
                TeamId = row["TeamId"] as int?
            };
        }
    }
}