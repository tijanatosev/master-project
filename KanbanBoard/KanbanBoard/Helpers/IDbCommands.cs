using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;

namespace KanbanBoard.Helpers
{
    public interface IDbCommands
    {
        int ExecuteSqlNonQuery(string sqlQuery, params DbParameter[] parameters);

        DataSet ExecuteSqlQuery(string sqlQuery, params DbParameter[] parameters);
    }
}