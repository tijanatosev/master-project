using System;
using System.Collections.Generic;
using System.Data;
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