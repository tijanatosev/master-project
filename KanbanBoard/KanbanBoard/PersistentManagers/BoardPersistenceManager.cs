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
        
        public IEnumerable<Board> GetBoards()
        {
            List<Board> boards = new List<Board>();
            DataSet result = dbCommands.ExecuteSqlQuery("select * from Boards");
            foreach (DataRow row in result.Tables["Result"].Rows)
            {
                boards.Add(LoadFromDataRow(row));
            }
            return boards;
        }

        public Board LoadFromDataRow(DataRow row)
        {
            Board board = new Board();
            board.Id = Convert.ToInt32(row["Id"]);
            board.Name = row["Name"].ToString();
            board.Admin = row["Admin"].ToString();
            board.TeamId = row["TeamId"] as int?;
            return board;
        }
    }
}