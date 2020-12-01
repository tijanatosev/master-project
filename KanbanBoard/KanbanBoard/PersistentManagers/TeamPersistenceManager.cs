using System;
using System.Collections.Generic;
using System.Data;
using KanbanBoard.Helpers;

namespace KanbanBoard.Models
{
    public class TeamPersistenceManager : ITeamPersistenceManager
    {
        private string serverName = "W-PF1EP858\\SQLEXPRESS";
        private string dbName = "KanbanBoard";
        private IDbCommands dbCommands;

        public TeamPersistenceManager()
        {
            dbCommands = new DbCommands(serverName, dbName);
        }

        public IEnumerable<Team> GetTeams()
        { 
            List<Team> teams = new List<Team>();
            DataSet result = dbCommands.ExecuteSqlQuery("select * from Teams");
            foreach (DataRow row in result.Tables["Result"].Rows)
            {
                teams.Add(LoadFromDataRow(row));
            }
            return teams;
        }

        public Team LoadFromDataRow(DataRow row)
        {
            Team team = new Team();
            team.Id = Convert.ToInt32(row["Id"]);
            team.Name = row["Name"].ToString();
            team.Admin = row["Admin"].ToString();
            return team;
        }
    }
}