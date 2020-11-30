using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace KanbanBoard.Helpers
{
    public class DbCommands : IDbCommands
    {
        private SqlConnection sqlConnection;
        private SqlCommand sqlCommand;
        private SqlDataReader sqlDataReader;
        private SqlDataAdapter sqlDataAdapter;
        private SqlConnectionStringBuilder connectionStringBuilder;

        public DbCommands(string serverName, string dbName)
        {
            connectionStringBuilder = new SqlConnectionStringBuilder
            {
                DataSource = serverName,
                InitialCatalog = dbName,
                IntegratedSecurity = true
            };

            sqlConnection = new SqlConnection
            {
                ConnectionString = connectionStringBuilder.ConnectionString
            };
        }

        public DbCommands(string serverName, string dbName, string dbUser, string dbPassword)
        {
            connectionStringBuilder = new SqlConnectionStringBuilder
            {
                DataSource = serverName,
                InitialCatalog = dbName,
                UserID = dbUser,
                Password = dbPassword
            };
            
            sqlConnection = new SqlConnection
            {
                ConnectionString = connectionStringBuilder.ConnectionString
            };
        }
        
        public int ExecuteSqlNonQuery(string sqlQuery)
        {
            try
            {
                if (sqlConnection.State != ConnectionState.Open)
                {
                    sqlConnection.Open();
                }

                using (sqlCommand = new SqlCommand(sqlQuery))
                {
                    sqlCommand.Connection = sqlConnection;
                    return sqlCommand.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (sqlConnection.State == ConnectionState.Open)
                {
                    sqlConnection.Close();
                }
            }
        }

        public DataSet ExecuteSqlQuery(string sqlQuery)
        {
            try
            {
                if (sqlConnection.State != ConnectionState.Open)
                {
                    sqlConnection.Open();
                }
                
                DataSet result = new DataSet();
                using (sqlCommand = new SqlCommand(sqlQuery))
                {
                    sqlCommand.Connection = sqlConnection;
                    sqlDataAdapter = new SqlDataAdapter(sqlCommand.CommandText, sqlCommand.Connection);
                    sqlDataAdapter.Fill(result, "Result");
                    return result;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (sqlConnection.State == ConnectionState.Open)
                {
                    sqlConnection.Close();
                }
            }
        }
    }
}