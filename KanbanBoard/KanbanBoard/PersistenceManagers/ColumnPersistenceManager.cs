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
            DataTable result = dbCommands.ExecuteSqlQuery(sqlQuery, new SqlParameter("@Id", id)).Tables["Result"];
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
            DataTable result = dbCommands.ExecuteSqlQuery(query, new SqlParameter("@BoardId", boardId)).Tables["Result"];
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
OUTPUT INSERTED.ID VALUES 
(@Name, @ColumnOrder, @IsDone, @BoardId)";
            DbParameter[] parameters = 
            {
                new SqlParameter("@Name", column.Name),
                new SqlParameter("@ColumnOrder", column.ColumnOrder),
                new SqlParameter("@IsDone", column.IsDone), 
                new SqlParameter("@BoardId", column.BoardId)
            };
            return dbCommands.ExecuteScalar(query, parameters);
        }
        
        public void Delete(int id)
        {
            string query = @"DELETE FROM Columns WHERE Id=@Id";
            dbCommands.ExecuteSqlNonQuery(query, new SqlParameter("@Id", id));
        }

        public int UpdateColumnOrder(int id, int columnOrder)
        {
            string query = @"UPDATE Columns
SET ColumnOrder=@ColumnOrder
WHERE Id=@Id";
            return dbCommands.ExecuteSqlNonQuery(query, new SqlParameter("@ColumnOrder", columnOrder), new SqlParameter("@Id", id));
        }

        public void DeleteByBoardId(int boardId)
        {
            string query = @"DELETE FROM Columns WHERE BoardId=@BoardId";
            dbCommands.ExecuteSqlNonQuery(query, new SqlParameter("@BoardId", boardId));
        }

        public int UpdateIsDone(int id, int boardId)
        {
            string queryAll = @"UPDATE Columns
SET IsDone=0
WHERE BoardId=@BoardId";
            string queryOne = @"UPDATE Columns
SET IsDone=@IsDone
WHERE Id=@Id";
            dbCommands.ExecuteSqlNonQuery(queryAll, new SqlParameter("@BoardId", boardId));
            return dbCommands.ExecuteSqlNonQuery(queryOne, new SqlParameter("@IsDone", true), new SqlParameter("@Id", id));
        }

        public Column GetDoneColumnForBoard(int boardId)
        {
            string sqlQuery = @"SELECT * FROM Columns WHERE BoardId=@BoardId and IsDone = 1";
            DataTable result = dbCommands.ExecuteSqlQuery(sqlQuery, new SqlParameter("@BoardId", boardId)).Tables["Result"];
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