using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using KanbanBoard.Helpers;

namespace KanbanBoard.Models
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
            DataTable result = dbCommands.ExecuteSqlQuery("select * from Boards").Tables["Result"];
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
            string query = @"INSERT INTO Boards (Name, Admin, TeamId) VALUES(@Name, @Admin, @TeamId)";
            DbParameter[] parameters = 
            {
                new SqlParameter("@Name", board.Name),
                new SqlParameter("@Admin", board.Admin),
                new SqlParameter("@TeamId", board.TeamId), 
            };
            return dbCommands.ExecuteSqlNonQuery(query, parameters);
        }

        public void Delete(int id)
        {
            string query = @"DELETE FROM Boards WHERE Id=@Id";
            dbCommands.ExecuteSqlNonQuery(query, new SqlParameter("@Id", id));
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