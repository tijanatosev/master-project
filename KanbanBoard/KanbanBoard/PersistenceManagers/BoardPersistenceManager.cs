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
    public class BoardPersistenceManager : IBoardPersistenceManager
    {
        private string serverName = "W-PF1EP858\\SQLEXPRESS";
        private string dbName = "KanbanBoard";
        private IDbCommands dbCommands;

        public BoardPersistenceManager()
        {
            dbCommands = new DbCommands(serverName, dbName);
        }
        
        public IEnumerable<Board> LoadAll()
        {
            List<Board> boards = new List<Board>();
            DataTable result = dbCommands.ExecuteSqlQuery("SELECT * FROM Boards").Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    boards.Add(LoadFromDataRow(row));
                }
            }
            return boards;
        }

        public Board Load(int id)
        {
            string sqlQuery = @"SELECT * FROM Boards WHERE Id=@Id";
            DataTable result = dbCommands.ExecuteSqlQuery(sqlQuery, new SqlParameter("@Id", id)).Tables["Result"];

            if (result.Rows.Count != 0)
            {
                return LoadFromDataRow(result.Rows[0]);
            }
            return null;
        }

        public int Add(Board board)
        {
            string query = @"INSERT INTO Boards (Name, Admin, TeamId) OUTPUT INSERTED.ID VALUES(@Name, @Admin, @TeamId)";
            DbParameter[] parameters = 
            {
                new SqlParameter("@Name", board.Name),
                new SqlParameter("@Admin", board.Admin),
                new SqlParameter("@TeamId", board.TeamId), 
            };
            return dbCommands.ExecuteScalar(query, parameters);
        }

        public int Update(int id, Board board)
        {
            DbParameter teamId;
            if (board.TeamId == null)
            {
                teamId = new SqlParameter("@TeamId", DBNull.Value);
            }
            else
            {
                teamId = new SqlParameter("@TeamId", board.TeamId);
            }
            string query = @"UPDATE Boards SET
Name=@Name,
Admin=@Admin,
TeamId=@TeamId
WHERE Id=@Id";
            DbParameter[] parameters = 
            {
                new SqlParameter("@Name", board.Name),
                new SqlParameter("@Admin", board.Admin),
                teamId,
                new SqlParameter("@Id", board.Id), 
            };
            return dbCommands.ExecuteSqlNonQuery(query, parameters);
        }

        public void Delete(int id)
        {
            string query = @"DELETE FROM Boards WHERE Id=@Id";
            dbCommands.ExecuteSqlNonQuery(query, new SqlParameter("@Id", id));
        }

        public IEnumerable<Board> LoadByUserId(int userId)
        {
            List<Board> boards = new List<Board>();
            string sqlQuery = @"SELECT b.Id, b.Name, b.Admin, b.TeamId
FROM Boards b JOIN Teams t ON b.TeamId=t.Id
JOIN UsersTeams ut ON ut.TeamId=b.TeamId
WHERE ut.UserId=@UserId";
            DataTable result = dbCommands.ExecuteSqlQuery(sqlQuery, new SqlParameter("@UserId", userId)).Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    boards.Add(LoadFromDataRow(row));
                }
            }
            return boards;
        }

        public IEnumerable<Board> LoadByTeamId(int teamId)
        { 
            List<Board> boards = new List<Board>();
            string sqlQuery = @"SELECT * FROM Boards WHERE TeamId=@TeamId";
            DataTable result = dbCommands.ExecuteSqlQuery(sqlQuery, new SqlParameter("@TeamId", teamId)).Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    boards.Add(LoadFromDataRow(row));
                }
            }
            return boards;
        }

        public Board LoadFromDataRow(DataRow row)
        {
            return new Board
            {
                Id = Convert.ToInt32(row["Id"]),
                Name = row["Name"].ToString(),
                Admin = row["Admin"].ToString(),
                TeamId = row["TeamId"] as int?
            };
        }
    }
}