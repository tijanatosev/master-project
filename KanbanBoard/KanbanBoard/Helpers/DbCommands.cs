using System;
using System.Data;
using System.Data.Common;
using MySqlConnector;

namespace KanbanBoard.Helpers
{
    public class DbCommands : IDbCommands
    {
        private readonly MySqlConnection sqlConnection;
        private MySqlCommand sqlCommand;
        private MySqlDataAdapter sqlDataAdapter;

        public DbCommands(ConnectionStringConfiguration connectionStringConfiguration)
        {
            sqlConnection = new MySqlConnection(connectionStringConfiguration.Default);
        }

        public int ExecuteSqlNonQuery(string sqlQuery, params DbParameter[] parameters)
        {
            try
            {
                if (sqlConnection.State != ConnectionState.Open)
                {
                    sqlConnection.Open();
                }

                using (sqlCommand = new MySqlCommand(sqlQuery))
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
                using (sqlCommand = new MySqlCommand(sqlQuery))
                {
                    sqlCommand.Connection = sqlConnection;
                    if (parameters != null)
                    {
                        foreach (DbParameter parameter in parameters)
                        {
                            sqlCommand.Parameters.Add(parameter);
                        }
                    }
                    sqlDataAdapter = new MySqlDataAdapter(sqlCommand.CommandText, sqlCommand.Connection);
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

        public int ExecuteScalarReturnInsertId(string sqlQuery, params DbParameter[] parameters)
        {
            try
            {
                if (sqlConnection.State != ConnectionState.Open)
                {
                    sqlConnection.Open();
                }

                using (sqlCommand = new MySqlCommand(sqlQuery))
                {
                    sqlCommand.Connection = sqlConnection;
                    foreach (DbParameter parameter in parameters)
                    {
                        sqlCommand.Parameters.Add(parameter);
                    }

                    sqlCommand.ExecuteScalar();
                    return (int) sqlCommand.LastInsertedId;
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