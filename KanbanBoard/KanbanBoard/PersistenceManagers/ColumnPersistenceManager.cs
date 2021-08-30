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
    public class ColumnPersistenceManager : IColumnPersistenceManager
    {
        private readonly IDbCommands dbCommands = new DbCommands();

        public IEnumerable<Column> LoadAll()
        {
            List<Column> columns = new List<Column>();
            string query = @"SELECT * FROM Columns";
            DataTable result = dbCommands.ExecuteSqlQuery(query).Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    columns.Add(LoadFromDataRow(row));
                }
            }
            return columns;
        }

        public Column Load(int id)
        {
            string sqlQuery = @"SELECT * FROM Columns WHERE Id=@Id";
            DataTable result = dbCommands.ExecuteSqlQuery(sqlQuery, new MySqlParameter("@Id", id)).Tables["Result"];
            if (result.Rows.Count != 0)
            {
                return LoadFromDataRow(result.Rows[0]);
            }
            return null;
        }

        public IEnumerable<Column> LoadByBoardId(int boardId)
        {
            List<Column> columns = new List<Column>();
            string query = @"SELECT * FROM Columns WHERE BoardId=@BoardId ORDER BY ColumnOrder ASC";
            DataTable result = dbCommands.ExecuteSqlQuery(query, new MySqlParameter("@BoardId", boardId)).Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    columns.Add(LoadFromDataRow(row));
                }
            }
            return columns;
        }

        public int Add(Column column)
        {
            string query = @"INSERT INTO Columns (Name, ColumnOrder, IsDone, BoardId) 
VALUES (@Name, @ColumnOrder, @IsDone, @BoardId)";
            DbParameter[] parameters = 
            {
                new MySqlParameter("@Name", column.Name),
                new MySqlParameter("@ColumnOrder", column.ColumnOrder),
                new MySqlParameter("@IsDone", column.IsDone), 
                new MySqlParameter("@BoardId", column.BoardId)
            };
            dbCommands.ExecuteSqlNonQuery(query, parameters);
            return Convert.ToInt32(dbCommands.ExecuteScalar("SELECT LAST_INSERT_ID();"));
        }
        
        public void Delete(int id)
        {
            string query = @"DELETE FROM Columns WHERE Id=@Id";
            dbCommands.ExecuteSqlNonQuery(query, new MySqlParameter("@Id", id));
        }

        public int Update(int id, Column column)
        {
            string query = @"UPDATE Columns
SET Name=@Name
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(query, new MySqlParameter("@Name", column.Name), new MySqlParameter("@Id", id));
        }

        public int UpdateColumnOrder(int id, int columnOrder)
        {
            string query = @"UPDATE Columns
SET ColumnOrder=@ColumnOrder
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(query, new MySqlParameter("@ColumnOrder", columnOrder), new MySqlParameter("@Id", id));
        }

        public void DeleteByBoardId(int boardId)
        {
            string query = @"DELETE FROM Columns WHERE BoardId=@BoardId";
            dbCommands.ExecuteSqlNonQuery(query, new MySqlParameter("@BoardId", boardId));
        }

        public int UpdateIsDone(int id, int boardId)
        {
            string queryAll = @"UPDATE Columns
SET IsDone=0
WHERE BoardId=@BoardId";
            string queryOne = @"UPDATE Columns
SET IsDone=@IsDone
WHERE Id=@Id";
            dbCommands.ExecuteSqlNonQuery(queryAll, new MySqlParameter("@BoardId", boardId));
            return dbCommands.ExecuteSqlNonQuery(queryOne, new MySqlParameter("@IsDone", true), new MySqlParameter("@Id", id));
        }

        public Column GetDoneColumnForBoard(int boardId)
        {
            string sqlQuery = @"SELECT * FROM Columns WHERE BoardId=@BoardId and IsDone = 1";
            DataTable result = dbCommands.ExecuteSqlQuery(sqlQuery, new MySqlParameter("@BoardId", boardId)).Tables["Result"];
            if (result.Rows.Count != 0)
            {
                return LoadFromDataRow(result.Rows[0]);
            }
            return null;
        }

        public Column LoadFromDataRow(DataRow row)
        {
            return new Column
            {
                Id = Convert.ToInt32(row["Id"]),
                Name = row["Name"].ToString(),
                ColumnOrder = Convert.ToInt32(row["ColumnOrder"]),
                IsDone = Convert.ToBoolean(row["IsDone"]),
                BoardId = Convert.ToInt32(row["BoardId"])
            };
        }
    }
}