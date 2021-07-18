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
            DataTable result = dbCommands.ExecuteSqlQuery(query, new SqlParameter("@Id", id)).Tables["Result"];
            
            if (result.Rows.Count != 0)
            {
                return LoadFromDataRow(result.Rows[0]);
            }
            return null;
        }

        public User Load(string username)
        {
            string query = @"SELECT * FROM Users WHERE Username=@Username";
            DataTable result = dbCommands.ExecuteSqlQuery(query, new SqlParameter("@Username", username)).Tables["Result"];
            
            if (result.Rows.Count != 0)
            {
                return LoadFromDataRow(result.Rows[0]);
            }
            return null;
        }

        public int Add(User user)
        {
            string query = @"INSERT INTO Users (FirstName, LastName, Username, Password, Email, UserType, Image) 
OUTPUT INSERTED.ID
VALUES (@FirstName, @LastName, @Username, @Password, @Email, @UserType, @Image)";
            DbParameter[] parameters = 
            {
                new SqlParameter("@FirstName", user.FirstName),
                new SqlParameter("@LastName", user.LastName),
                new SqlParameter("@Username", user.Username),
                new SqlParameter("@Password", user.Password),
                new SqlParameter("@Email", user.Email),
                new SqlParameter("@UserType", user.UserType),
                new SqlParameter("@Image", "Resources\\Images\\profile.png"), 
            };
            return dbCommands.ExecuteScalar(query, parameters);
        }

        public int Update(User user)
        {
            string query = @"UPDATE Users SET
Username=@Username,
FirstName=@FirstName,
LastName=@LastName,
Email=@Email
WHERE Id=@Id";
            DbParameter[] parameters = 
            {
                new SqlParameter("@Username", user.Username),
                new SqlParameter("@FirstName", user.FirstName),
                new SqlParameter("@LastName", user.LastName),
                new SqlParameter("@Email", user.Email),
                new SqlParameter("@Id", user.Id) 
            };
            return dbCommands.ExecuteSqlNonQuery(query, parameters);
        }

        public int UpdatePassword(int id, string password)
        {
            string query = @"UPDATE Users SET Password=@Password WHERE Id=@Id";
            DbParameter[] parameters = 
            {
                new SqlParameter("@Password", password),
                new SqlParameter("@Id", id)
            };
            return dbCommands.ExecuteSqlNonQuery(query, parameters);
        }

        public void Delete(int id)
        {
            string queryUsersTeams = @"DELETE FROM UsersTeams WHERE UserId=@UserId";
            string queryUsers = @"DELETE FROM Users WHERE Id=@Id";
            dbCommands.ExecuteSqlNonQuery(queryUsersTeams, new SqlParameter("@UserId", id));
            dbCommands.ExecuteSqlNonQuery(queryUsers, new SqlParameter("@Id", id));
        }

        public IEnumerable<User> LoadByTeamId(int teamId)
        {
            List<User> users = new List<User>();
            string query = @"SELECT u.Id, u.Username, u.Password, u.FirstName, u.LastName, u.Email, u.UserType, u.Image 
FROM UsersTeams ut JOIN Users u ON ut.UserId=u.Id 
WHERE ut.TeamId=@TeamId";
            DataTable result = dbCommands.ExecuteSqlQuery(query, new SqlParameter("@TeamId", teamId)).Tables["Result"];

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

        public int UpdateImage(int id, string image)
        {
            string query = @"UPDATE Users SET
Image=@Image
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(query, new SqlParameter("@Image", image), new SqlParameter("@Id", id));
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
                Image = row["Image"].ToString()
            };
        }
    }
}