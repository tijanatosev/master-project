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
    public class LabelPersistenceManager : ILabelPersistenceManager
    {
        private string serverName = "W-PF1EP858\\SQLEXPRESS";
        private string dbName = "KanbanBoard";
        private IDbCommands dbCommands;

        public LabelPersistenceManager()
        {
            dbCommands = new DbCommands(serverName, dbName);
        }

        public IEnumerable<Label> LoadAll()
        {
            List<Label> labels = new List<Label>();
            DataTable result = dbCommands.ExecuteSqlQuery("SELECT * FROM Labels").Tables["Result"];
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    labels.Add(LoadFromDataRow(row));
                }
            }
            return labels;
        }

        public Label Load(int id)
        {
            string sqlQuery = @"SELECT * FROM Labels WHERE Id=@Id";
            DataTable result = dbCommands.ExecuteSqlQuery(sqlQuery, new SqlParameter("@Id", id)).Tables["Result"];

            if (result.Rows.Count != 0)
            {
                return LoadFromDataRow(result.Rows[0]);
            }
            return null;
        }

        public int Add(Label label)
        {
            string query = @"INSERT INTO Labels (Name, Color) OUTPUT INSERTED.ID VALUES(@Name, @Color)";
            DbParameter[] parameters = 
            {
                new SqlParameter("@Name", label.Name),
                new SqlParameter("@Color", label.Color)
            };
            return dbCommands.ExecuteScalar(query, parameters);
        }

        public void Delete(int id)
        {
            string query = @"DELETE FROM Labels WHERE Id=@Id";
            dbCommands.ExecuteSqlNonQuery(query, new SqlParameter("@Id", id));
        }

        public void DeleteAll()
        {
            string query = @"DELETE FROM Labels";
            dbCommands.ExecuteSqlNonQuery(query);
        }

        public Label LoadFromDataRow(DataRow row)
        {
            return new Label
            {
                Id = Convert.ToInt32(row["Id"]),
                Name = row["Name"].ToString(),
                Color = row["Color"].ToString()
            };
        }
    }
}