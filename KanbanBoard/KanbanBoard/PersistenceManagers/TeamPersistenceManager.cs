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
    public class TeamPersistenceManager : ITeamPersistenceManager
    {
        private readonly IDbCommands dbCommands;

        public TeamPersistenceManager(ConnectionStringConfiguration connectionStringConfiguration)
        {
            dbCommands = new DbCommands(connectionStringConfiguration);
        }

        public IEnumerable<Team> LoadAll()
        { 
            List<Team> teams = new List<Team>();
            DataTable result = dbCommands.ExecuteSqlQuery("SELECT * FROM Teams").Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    teams.Add(LoadFromDataRow(row));
                }
            }
            return teams;
        }

        public Team Load(int id)
        {
            string sqlQuery = @"SELECT * FROM Teams WHERE Id=@Id";
            DataTable result = dbCommands.ExecuteSqlQuery(sqlQuery, new MySqlParameter("@Id", id)).Tables["Result"];

            if (result.Rows.Count != 0)
            {
                return LoadFromDataRow(result.Rows[0]);
            }
            return null;
        }

        public Team LoadByName(string name)
        {
            string sqlQuery = @"SELECT * FROM Teams WHERE Name=@Name";
            DataTable result = dbCommands.ExecuteSqlQuery(sqlQuery, new MySqlParameter("@Name", name)).Tables["Result"];

            if (result.Rows.Count != 0)
            {
                return LoadFromDataRow(result.Rows[0]);
            }
            return null;
        }

        public int Add(Team team)
        {
            string query = @"INSERT INTO Teams (Name, Admin)
VALUES(@Name, @Admin)";
            DbParameter[] parameters = 
            {
                new MySqlParameter("@Name", team.Name),
                new MySqlParameter("@Admin", team.Admin)
            };
            return dbCommands.ExecuteScalarReturnInsertId(query, parameters);
        }

        public void Delete(int id)
        {
            string queryUsersTeams = @"DELETE FROM UsersTeams WHERE TeamId=@TeamId";
            string queryBoards = @"DELETE FROM Boards WHERE TeamId=@TeamId";
            string queryTeams = @"DELETE FROM Teams WHERE Id=@Id";
            dbCommands.ExecuteSqlNonQuery(queryUsersTeams, new MySqlParameter("@TeamId", id));
            dbCommands.ExecuteSqlNonQuery(queryBoards, new MySqlParameter("@TeamId", id));
            dbCommands.ExecuteSqlNonQuery(queryTeams, new MySqlParameter("@Id", id));
        }

        public IEnumerable<Team> LoadByUserId(int userId)
        {
            List<Team> teams = new List<Team>();
            string query = @"SELECT t.Id, t.Admin, t.Name
FROM Teams t JOIN UsersTeams ut ON t.Id=ut.TeamId
WHERE ut.UserId=@UserId";
            DataTable result = dbCommands.ExecuteSqlQuery(query, new MySqlParameter("@UserId", userId)).Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    teams.Add(LoadFromDataRow(row));
                }
            }
            return teams;
        }

        public int AddUsersToTeam(int teamId, List<int> userIds)
        {
            int rowsAdded = 0;
            string queryDelete = @"DELETE FROM UsersTeams where TeamId=@TeamId";
            dbCommands.ExecuteSqlNonQuery(queryDelete, new MySqlParameter("@TeamId", teamId));
            string query = @"INSERT INTO UsersTeams (UserId, TeamId) VALUES (@UserId, " + teamId + ")";
            foreach (int userId in userIds)
            {
                rowsAdded += dbCommands.ExecuteSqlNonQuery(query, new MySqlParameter("@UserId", userId));
            }

            return rowsAdded;
        }

        public Team LoadFromDataRow(DataRow row)
        {
            return new Team
            {
                Id = Convert.ToInt32(row["Id"]), 
                Name = row["Name"].ToString(), 
                Admin = row["Admin"].ToString()
            };
        }
    }
}