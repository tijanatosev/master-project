﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using KanbanBoard.Helpers;
using KanbanBoard.Models;
using KanbanBoard.PersistenceManagers.Interfaces;
using MySqlConnector;

namespace KanbanBoard.PersistenceManagers
{
    public class BoardPersistenceManager : IBoardPersistenceManager
    {
        private readonly IDbCommands dbCommands;

        public BoardPersistenceManager(ConnectionStringConfiguration connectionStringConfiguration)
        {
            dbCommands = new DbCommands(connectionStringConfiguration);
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
            DataTable result = dbCommands.ExecuteSqlQuery(sqlQuery, new MySqlParameter("@Id", id)).Tables["Result"];

            if (result.Rows.Count != 0)
            {
                return LoadFromDataRow(result.Rows[0]);
            }
            return null;
        }

        public int Add(Board board)
        {
            string query = @"INSERT INTO Boards (Name, Admin, TeamId, IsPomodoro, WorkTime, BreakTime, Iterations, LongerBreak) 
VALUES(@Name, @Admin, @TeamId, @IsPomodoro, @WorkTime, @BreakTime, @Iterations, @LongerBreak)";
            DbParameter[] parameters = 
            {
                new MySqlParameter("@Name", board.Name),
                new MySqlParameter("@Admin", board.Admin),
                new MySqlParameter("@TeamId", board.TeamId),
                new MySqlParameter("@IsPomodoro", board.IsPomodoro),
                new MySqlParameter("@WorkTime", board.WorkTime),
                new MySqlParameter("@BreakTime", board.BreakTime),
                new MySqlParameter("@Iterations", board.Iterations), 
                new MySqlParameter("@LongerBreak", board.LongerBreak), 
            };
            return dbCommands.ExecuteScalarReturnInsertId(query, parameters);
        }

        public int Update(int id, Board board)
        {
            DbParameter teamId;
            if (board.TeamId == null)
            {
                teamId = new MySqlParameter("@TeamId", DBNull.Value);
            }
            else
            {
                teamId = new MySqlParameter("@TeamId", board.TeamId);
            }
            string query = @"UPDATE Boards SET
Name=@Name,
Admin=@Admin,
TeamId=@TeamId,
IsPomodoro=@IsPomodoro,
WorkTime=@WorkTime,
BreakTime=@BreakTime,
Iterations=@Iterations,
LongerBreak=@LongerBreak
WHERE Id=@Id";
            DbParameter[] parameters = 
            {
                new MySqlParameter("@Name", board.Name),
                new MySqlParameter("@Admin", board.Admin),
                teamId,
                new MySqlParameter("@IsPomodoro", board.IsPomodoro),
                new MySqlParameter("@WorkTime", board.WorkTime),
                new MySqlParameter("@BreakTime", board.BreakTime), 
                new MySqlParameter("@Iterations", board.Iterations), 
                new MySqlParameter("@LongerBreak", board.LongerBreak),
                new MySqlParameter("@Id", board.Id),
            };
            return dbCommands.ExecuteSqlNonQuery(query, parameters);
        }

        public void Delete(int id)
        {
            string queryColumns = @"DELETE FROM Columns WHERE BoardId=@BoardId";
            string query = @"DELETE FROM Boards WHERE Id=@Id";
            dbCommands.ExecuteSqlNonQuery(queryColumns, new MySqlParameter("@BoardId", id));
            dbCommands.ExecuteSqlNonQuery(query, new MySqlParameter("@Id", id));
        }

        public IEnumerable<Board> LoadByUserId(int userId)
        {
            List<Board> boards = new List<Board>();
            string sqlQuery = @"SELECT b.Id, b.Name, b.Admin, b.TeamId, b.IsPomodoro, b.WorkTime, b.BreakTime, b.Iterations, b.LongerBreak
FROM Boards b JOIN Teams t ON b.TeamId=t.Id
JOIN UsersTeams ut ON ut.TeamId=b.TeamId
WHERE ut.UserId=@UserId";
            DataTable result = dbCommands.ExecuteSqlQuery(sqlQuery, new MySqlParameter("@UserId", userId)).Tables["Result"];
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
            DataTable result = dbCommands.ExecuteSqlQuery(sqlQuery, new MySqlParameter("@TeamId", teamId)).Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    boards.Add(LoadFromDataRow(row));
                }
            }
            return boards;
        }

        public Dictionary<string, int> GetNumberOfTicketsPerColumn(int id)
        {
            Dictionary<string, int> values = new Dictionary<string, int>();
            string sql = @"SELECT COUNT(*) AS NumOfTickets, c.Name AS ColumnName
FROM Tickets t JOIN Columns c ON t.ColumnId=c.Id 
WHERE t.BoardId=@BoardId
GROUP BY c.Name";
            DataTable result = dbCommands.ExecuteSqlQuery(sql, new MySqlParameter("@BoardId", id)).Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    values.Add(row["ColumnName"].ToString()!, Convert.ToInt32(row["NumOfTickets"]));
                }
            }
            return values;
        }

        public Dictionary<string, int> GetNumberOfTicketsPerLabel(int id)
        {
            Dictionary<string, int> values = new Dictionary<string, int>();
            string sql = @"SELECT COUNT(*) AS NumOfTickets, l.Name AS LabelName
FROM Tickets t JOIN LabelsTickets lt ON t.Id=lt.TicketId JOIN Labels l ON l.Id=lt.LabelId
WHERE t.BoardId=@BoardId
GROUP BY l.Name";
            DataTable result = dbCommands.ExecuteSqlQuery(sql, new MySqlParameter("@BoardId", id)).Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    values.Add(row["LabelName"].ToString()!, Convert.ToInt32(row["NumOfTickets"]));
                }
            }
            return values;
        }

        public Board LoadFromDataRow(DataRow row)
        {
            return new Board
            {
                Id = Convert.ToInt32(row["Id"]),
                Name = row["Name"].ToString(),
                Admin = row["Admin"].ToString(),
                TeamId = row["TeamId"] as int?,
                IsPomodoro = Convert.ToBoolean(row["IsPomodoro"]),
                WorkTime = Convert.ToInt32(row["WorkTime"]),
                BreakTime = Convert.ToInt32(row["BreakTime"]),
                Iterations = Convert.ToInt32(row["Iterations"]),
                LongerBreak = Convert.ToInt32(row["LongerBreak"])
            };
        }
    }
}