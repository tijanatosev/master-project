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
            DataTable result = dbCommands.ExecuteSqlQuery("SELECT * FROM Users").Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    User user = LoadFromDataRow(row);
                    user.Password = String.Empty;
                    users.Add(user);
                }
            }
            return users;
        }

        public User Load(int id)
        {
            string query = @"SELECT * FROM Users WHERE Id=@Id";
            DataTable result =dbCommands.ExecuteSqlQuery(query, new SqlParameter("@Id", id)).Tables["Result"];
            
            if (result.Rows.Count != 0)
            {
                return LoadFromDataRow(result.Rows[0]);
            }
            return null;
        }

        public User Load(string username)
        {
            string query = @"SELECT * FROM Users WHERE Username=@Username";
            DataTable result =dbCommands.ExecuteSqlQuery(query, new SqlParameter("@Username", username)).Tables["Result"];
            
            if (result.Rows.Count != 0)
            {
                return LoadFromDataRow(result.Rows[0]);
            }
            return null;
        }

        public int Add(User user)
        {
            string query = @"INSERT INTO Users (FirstName, LastName, Username, Password, Email, UserType) 
VALUES (@FirstName, @LastName, @Username, @Password, @Email, @UserType)";
            DbParameter[] parameters = 
            {
                new SqlParameter("@FirstName", user.FirstName),
                new SqlParameter("@LastName", user.LastName),
                new SqlParameter("@Username", user.Username),
                new SqlParameter("@Password", user.Password),
                new SqlParameter("@Email", user.Email),
                new SqlParameter("@UserType", user.UserType), 
            };
            return dbCommands.ExecuteSqlNonQuery(query, parameters);
        }

        public void Delete(int id)
        {
            string queryUsersTeams = @"DELETE FROM UsersTeams WHERE UsedId=@UserId";
            string queryUsers = @"DELETE FROM Users WHERE Id=@Id";
            dbCommands.ExecuteSqlNonQuery(queryUsersTeams, new SqlParameter("@UserId", id));
            dbCommands.ExecuteSqlNonQuery(queryUsers, new SqlParameter("@Id", id));
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
                UserType = row["UserType"].ToString()
            };
        }
    }
}