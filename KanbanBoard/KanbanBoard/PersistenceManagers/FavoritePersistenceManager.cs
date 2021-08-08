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
    public class FavoritePersistenceManager : IFavoritePersistenceManager
    {
        private readonly IDbCommands dbCommands = new DbCommands();

        public IEnumerable<Favorite> LoadByUserId(int userId)
        {
            List<Favorite> favorites = new List<Favorite>();
            string query = @"SELECT * FROM Favorites WHERE UserId=@UserId";
            DataTable result = dbCommands.ExecuteSqlQuery(query, new SqlParameter("@UserId", userId)).Tables["Result"];
            
            if (result.Rows.Count != 0)
            {
                foreach (DataRow row in result.Rows)
                {
                    favorites.Add(LoadFromDataRow(row));
                }
            }
            return favorites;
        }

        public Favorite Load(int ticketId, int userId)
        {
            string query = @"SELECT * FROM Favorites WHERE TicketId=@TicketId AND UserId=@UserId";
            DataTable result = dbCommands.ExecuteSqlQuery(query, new SqlParameter("@TicketId", ticketId), new SqlParameter("@UserId", userId)).Tables["Result"];
            
            if (result.Rows.Count != 0)
            {
                return LoadFromDataRow(result.Rows[0]);
            }
            return null;
        }

        public int Add(Favorite favorite)
        {
            string query = @"INSERT INTO Favorites (TicketId, UserId) 
OUTPUT INSERTED.ID
VALUES (@TicketId, @UserId)";
            DbParameter[] parameters = 
            {
                new SqlParameter("@TicketId", favorite.TicketId),
                new SqlParameter("@UserId", favorite.UserId)
            };
            return dbCommands.ExecuteScalar(query, parameters);
        }

        public void Delete(int ticketId, int userId)
        {
            string query = @"DELETE FROM Favorites WHERE TicketId=@TicketId AND UserId=@UserId";
            dbCommands.ExecuteSqlNonQuery(query, new SqlParameter("@TicketId", ticketId), new SqlParameter("@UserId", userId));
        }
        
        public Favorite LoadFromDataRow(DataRow row)
        {
            return new Favorite
            {
                Id = Convert.ToInt32(row["Id"]),
                TicketId = Convert.ToInt32(row["TicketId"]),
                UserId = Convert.ToInt32(row["UserId"])
            };
        }
    }
}