using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace KanbanBoard.Helpers
{
    public interface IDbCommands
    {
        int ExecuteSqlNonQuery(string sqlQuery);

        DataSet ExecuteSqlQuery(string sqlQuery);
    }
}