using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using KanbanBoard.Helpers;
using KanbanBoard.Models;
using KanbanBoard.PersistenceManagers;
using KanbanBoard.PersistenceManagers.Interfaces;
using KanbanBoard.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace KanbanBoard.Services
{
    public class TicketService : ITicketService
    {
        private readonly ITicketPersistenceManager ticketPersistenceManager = new TicketPersistenceManager();
        private readonly IColumnService columnService = new ColumnService();
        private readonly IValidationService validationService = new ValidationService();
        private readonly IUserService userService = new UserService();
        
        public IEnumerable<Ticket> GetAll(IQueryCollection queryCollection)
        {
            string parsedQuery = ParseQueryCollection(queryCollection);
            return ticketPersistenceManager.LoadAll();
        }

        public Ticket GetById(int id)
        {
            if (!validationService.ValidateId(id))
            {
                return null;
            }

            return ticketPersistenceManager.Load(id);
        }

        public int Add(Ticket ticket)
        {
            return ticketPersistenceManager.Add(ticket);
        }

        public void Delete(int id)
        {
            if (!validationService.ValidateId(id) || ticketPersistenceManager.Load(id) == null)
            {
                return;
            }
            
            ticketPersistenceManager.Delete(id);
        }
        
        public IEnumerable<Ticket> GetByUserId(int userId)
        {
            if (!validationService.ValidateId(userId))
            {
                return null;
            }

            return ticketPersistenceManager.LoadByUserId(userId);
        }

        public IEnumerable<Ticket> GetByTeamId(int teamId)
        {
            if (!validationService.ValidateId(teamId))
            {
                return new List<Ticket>();
            }

            return ticketPersistenceManager.LoadByTeamId(teamId);
        }

        public IEnumerable<Ticket> GetByColumnId(int columnId)
        {
            if (!validationService.ValidateId(columnId))
            {
                return new List<Ticket>();
            }

            return ticketPersistenceManager.LoadByColumnId(columnId);
        }

        public bool UpdateColumn(int id, int columnId)
        {
            if (!validationService.ValidateId(id) || ticketPersistenceManager.Load(id) == null)
            {
                return false;
            }

            Column column = columnService.GetById(columnId);
            if (column == null)
            {
                return false;
            }

            return ticketPersistenceManager.UpdateColumn(id, columnId, column.Name) > 0;
        }

        public bool UpdateRank(int id, int rank)
        {
            if (!validationService.ValidateId(id) || ticketPersistenceManager.Load(id) == null)
            {
                return false;
            }

            return ticketPersistenceManager.UpdateRank(id, rank) > 0;
        }

        public bool UpdateAssignedTo(int id, int userId)
        {
            if (!validationService.ValidateId(id) || ticketPersistenceManager.Load(id) == null)
            {
                return false;
            }

            return ticketPersistenceManager.UpdateAssignedTo(id, userId) > 0;
        }

        public bool UpdateStartDate(int id, string startDate)
        {
            if (!validationService.ValidateId(id) || ticketPersistenceManager.Load(id) == null)
            {
                return false;
            }
            
            DateTime.TryParse(startDate, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime date);
            if (date < new DateTime(1970, 1, 1))
            {
                return false;
            }

            return ticketPersistenceManager.UpdateStartDate(id, date.Date) > 0;
        }

        public bool UpdateEndDate(int id, string endDate)
        {
            if (!validationService.ValidateId(id) || ticketPersistenceManager.Load(id) == null)
            {
                return false;
            }

            DateTime.TryParse(endDate, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime date);
            if (date < new DateTime(1970, 1, 1))
            {
                return false;
            }

            return ticketPersistenceManager.UpdateEndDate(id, date.Date) > 0;
        }

        public bool UpdateStoryPoints(int id, int storyPoints)
        {
            if (!validationService.ValidateId(id) || ticketPersistenceManager.Load(id) == null)
            {
                return false;
            }

            return ticketPersistenceManager.UpdateStoryPoints(id, storyPoints) > 0;
        }

        public bool UpdateTitle(int id, string title)
        {
            if (!validationService.ValidateId(id) || ticketPersistenceManager.Load(id) == null)
            {
                return false;
            }

            return ticketPersistenceManager.UpdateTitle(id, title) > 0;
        }

        public bool UpdateDescription(int id, string description)
        {
            if (!validationService.ValidateId(id) || ticketPersistenceManager.Load(id) == null)
            {
                return false;
            }

            return ticketPersistenceManager.UpdateDescription(id, description) > 0;
        }

        public IEnumerable<Ticket> GetFavoritesByUserId(int userId)
        {
            if (!validationService.ValidateId(userId) || userService.GetById(userId) == null)
            {
                return new List<Ticket>();
            }

            return ticketPersistenceManager.LoadFavoritesByUserId(userId);
        }

        public bool UpdatePriority(int id, int priority)
        {
            if (!validationService.ValidateId(id) || ticketPersistenceManager.Load(id) == null)
            {
                return false;
            }

            return ticketPersistenceManager.UpdatePriority(id, priority) > 0;
        }
        
        public int GetRankForColumn(int columnId, int boardId)
        {
            if (!validationService.ValidateId(columnId) || !validationService.ValidateId(boardId))
            {
                return -1;
            }

            return ticketPersistenceManager.GetRankForColumn(columnId, boardId);
        }

        private string ParseQueryCollection(IQueryCollection queryCollection)
        {
            StringBuilder whereClause = new StringBuilder();
            foreach (KeyValuePair<string, StringValues> filterValues in queryCollection)
            {
                string condition = String.Empty;
                string[] lines = filterValues.Value.ToString().Split(",");
                for (int i = 0; i < lines.Length; i++)
                {
                    string[] values = lines[i].Split(" ");
                    switch (values[1])
                    {
                        case "like":
                            condition += values[0] + " = '%" + values[2].Substring(1, values[2].Length - 1) + "%'";
                            break;
                        case "eq":
                            condition += values[0] + " = " + values[2];
                            break;
                        case "gt":
                            condition += values[0] + " > " + values[2];
                            break;
                        case "ge":
                            condition += values[0] + " >= " + values[2];
                            break;
                        case "le":
                            condition += values[0] + " <= " + values[2];
                            break;
                        case "lt":
                            condition += values[0] + " < " + values[2];
                            break;
                        case "ne":
                            condition += values[0] + " <> " + values[2];
                            break;
                        default:
                            condition += values[0] + " " + values[1] + " " + values[2];
                            break;
                    }

                    if (i != lines.Length-1)
                    {
                        condition += " and ";
                    }
                }
                whereClause.Append(condition);
            }

            return whereClause.ToString();
        }
    }
}