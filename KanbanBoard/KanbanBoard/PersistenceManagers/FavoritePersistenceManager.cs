﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using KanbanBoard.Helpers;
using KanbanBoard.Models;
using KanbanBoard.PersistenceManagers.Interfaces;
using MySqlConnector;

namespace KanbanBoard.PersistenceManagers
{
    public class FavoritePersistenceManager : IFavoritePersistenceManager
    {
        private readonly IDbCommands dbCommands;

        public FavoritePersistenceManager(ConnectionStringConfiguration connectionStringConfiguration)
        {
            dbCommands = new DbCommands(connectionStringConfiguration);
        }

        public IEnumerable<Favorite> LoadByUserId(int userId)
        {
            List<Favorite> favorites = new List<Favorite>();
            string query = @"SELECT * FROM Favorites WHERE UserId=@UserId";
            DataTable result = dbCommands.ExecuteSqlQuery(query, new MySqlParameter("@UserId", userId)).Tables["Result"];
            
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
            DataTable result = dbCommands.ExecuteSqlQuery(query, new MySqlParameter("@TicketId", ticketId), new MySqlParameter("@UserId", userId)).Tables["Result"];
            
            if (result.Rows.Count != 0)
            {
                return LoadFromDataRow(result.Rows[0]);
            }
            return null;
        }

        public int Add(Favorite favorite)
        {
            string query = @"INSERT INTO Favorites (TicketId, UserId) 
VALUES (@TicketId, @UserId)";
            DbParameter[] parameters = 
            {
                new MySqlParameter("@TicketId", favorite.TicketId),
                new MySqlParameter("@UserId", favorite.UserId)
            };
            return dbCommands.ExecuteScalarReturnInsertId(query, parameters);
        }

        public void Delete(int ticketId, int userId)
        {
            string query = @"DELETE FROM Favorites WHERE TicketId=@TicketId AND UserId=@UserId";
            dbCommands.ExecuteSqlNonQuery(query, new MySqlParameter("@TicketId", ticketId), new MySqlParameter("@UserId", userId));
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