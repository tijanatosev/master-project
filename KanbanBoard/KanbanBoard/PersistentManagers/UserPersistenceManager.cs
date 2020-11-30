using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
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
            this.dbCommands = new DbCommands(serverName, dbName);
        }

        public IEnumerable<User> GetUsers()
        {
            List<User> users = new List<User>();
            DataSet dataReader = dbCommands.ExecuteSqlQuery("select * from Users");
            foreach (DataRow row in dataReader.Tables["Result"].Rows)
            {
                User user = new User();
                user.ID = Convert.ToInt32(row["ID"]);
                user.Username = row["USERNAME"].ToString();
                user.Password = row["PASSWORD"].ToString();
                user.FirstName = row["FIRSTNAME"].ToString();
                user.LastName = row["LASTNAME"].ToString();
                user.Email = row["EMAIL"].ToString();
                user.UserType = row["USERTYPE"].ToString();
                users.Add(user);
            }

            return users;
        }
    }
}