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
        private string serverName = "W-PF1EP858\\SQLEXPRESS";
        private string dbName = "KanbanBoard";
        private IDbCommands dbCommands;

        public ColumnPersistenceManager()
        {
            dbCommands = new DbCommands(serverName, dbName);
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
            string query = @"SELECT * FROM Columns WHERE BoardId=@BoardId";
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
            string query = @"INSERT INTO Columns (Name, BoardId) OUTPUT INSERTED.ID VALUES (@Name, @BoardId)";
            DbParameter[] parameters = 
            {
                new SqlParameter("@Name", column.Name),
                new SqlParameter("@Color", column.BoardId)
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
        
        public Column LoadFromDataRow(DataRow row)
        {
            return new Column
            {
                Id = Convert.ToInt32(row["Id"]),
                Name = row["Name"].ToString(),
                ColumnOrder = Convert.ToInt32(row["ColumnOrder"]),
                BoardId = Convert.ToInt32(row["BoardId"])
            };
        }
    }
}