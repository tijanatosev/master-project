using System.Data;
using System.Data.Common;

namespace KanbanBoard.Helpers
{
    public interface IDbCommands
    {
        int ExecuteSqlNonQuery(string sqlQuery, params DbParameter[] parameters);

        DataSet ExecuteSqlQuery(string sqlQuery, params DbParameter[] parameters);

        int ExecuteScalar(string sqlQuery, params DbParameter[] parameters);
    }
}