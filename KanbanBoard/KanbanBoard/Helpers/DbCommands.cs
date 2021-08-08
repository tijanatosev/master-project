using System;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;

namespace KanbanBoard.Helpers
{
    public class DbCommands : IDbCommands
    {
        private readonly SqlConnection sqlConnection;
        private SqlCommand sqlCommand;
        private SqlDataAdapter sqlDataAdapter;
        private const string ServerName = "W-PF1EP858\\SQLEXPRESS";
        private const string DatabaseName = "KanbanBoard";

        public DbCommands()
        {
            SqlConnectionStringBuilder connectionStringBuilder = new SqlConnectionStringBuilder
            {
                DataSource = ServerName,
                InitialCatalog = DatabaseName,
                IntegratedSecurity = true
            };

            sqlConnection = new SqlConnection
            {
                ConnectionString = connectionStringBuilder.ConnectionString
            };
        }

        public DbCommands(string dbUser, string dbPassword)
        {
            SqlConnectionStringBuilder connectionStringBuilder = new SqlConnectionStringBuilder
            {
                DataSource = ServerName,
                InitialCatalog = DatabaseName,
                UserID = dbUser,
                Password = dbPassword
            };

            sqlConnection = new SqlConnection
            {
                ConnectionString = connectionStringBuilder.ConnectionString
            };
        }
        
        public int ExecuteSqlNonQuery(string sqlQuery, params DbParameter[] parameters)
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
                    foreach (DbParameter parameter in parameters)
                    {
                        sqlCommand.Parameters.Add(parameter);
                    }
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

        public DataSet ExecuteSqlQuery(string sqlQuery, params DbParameter[] parameters)
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
                    if (parameters != null)
                    {
                        foreach (DbParameter parameter in parameters)
                        {
                            sqlCommand.Parameters.Add(parameter);
                        }
                    }
                    sqlDataAdapter = new SqlDataAdapter(sqlCommand.CommandText, sqlCommand.Connection);
                    sqlDataAdapter.SelectCommand = sqlCommand;
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

        public int ExecuteScalar(string sqlQuery, params DbParameter[] parameters)
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
                    foreach (DbParameter parameter in parameters)
                    {
                        sqlCommand.Parameters.Add(parameter);
                    }
                    return (int) sqlCommand.ExecuteScalar();
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