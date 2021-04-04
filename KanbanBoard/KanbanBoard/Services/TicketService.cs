﻿using System;
using System.Collections.Generic;
using KanbanBoard.Models;
using KanbanBoard.PersistenceManagers;
using KanbanBoard.PersistenceManagers.Interfaces;
using KanbanBoard.Services.Interfaces;

namespace KanbanBoard.Services
{
    public class TicketService : ITicketService
    {
        private ITicketPersistenceManager ticketPersistenceManager = new TicketPersistenceManager();
        private IColumnService columnService = new ColumnService();
        
        public IEnumerable<Ticket> GetAll()
        {
            return ticketPersistenceManager.LoadAll();
        }

        public Ticket GetById(int id)
        {
            if (!ValidateId(id))
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
            if (!ValidateId(id) || ticketPersistenceManager.Load(id) == null)
            {
                return;
            }
            
            ticketPersistenceManager.Delete(id);
        }
        
        public IEnumerable<Ticket> GetByUserId(int userId)
        {
            if (!ValidateId(userId))
            {
                return null;
            }

            return ticketPersistenceManager.LoadByUserId(userId);
        }

        public IEnumerable<Ticket> GetByTeamId(int teamId)
        {
            if (!ValidateId(teamId))
            {
                return new List<Ticket>();
            }

            return ticketPersistenceManager.LoadByTeamId(teamId);
        }

        public IEnumerable<Ticket> GetByColumnId(int columnId)
        {
            if (!ValidateId(columnId))
            {
                return new List<Ticket>();
            }

            return ticketPersistenceManager.LoadByColumnId(columnId);
        }

        public bool UpdateColumn(int id, int columnId)
        {
            if (!ValidateId(id) || ticketPersistenceManager.Load(id) == null)
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
            if (!ValidateId(id) || ticketPersistenceManager.Load(id) == null)
            {
                return false;
            }

            return ticketPersistenceManager.UpdateRank(id, rank) > 0;
        }

        public bool UpdateAssignedTo(int id, int userId)
        {
            if (!ValidateId(id) || ticketPersistenceManager.Load(id) == null)
            {
                return false;
            }

            return ticketPersistenceManager.UpdateAssignedTo(id, userId) > 0;
        }

        public bool UpdateStartDate(int id, string startDate)
        {
            if (!ValidateId(id) || ticketPersistenceManager.Load(id) == null)
            {
                return false;
            }

            return ticketPersistenceManager.UpdateStartDate(id, DateTime.Parse(startDate)) > 0;
        }

        public bool UpdateEndDate(int id, string endDate)
        {
            if (!ValidateId(id) || ticketPersistenceManager.Load(id) == null)
            {
                return false;
            }

            return ticketPersistenceManager.UpdateEndDate(id, DateTime.Parse(endDate)) > 0;
        }

        public bool UpdateStoryPoints(int id, int storyPoints)
        {
            if (!ValidateId(id) || ticketPersistenceManager.Load(id) == null)
            {
                return false;
            }

            return ticketPersistenceManager.UpdateStoryPoints(id, storyPoints) > 0;
        }

        private bool ValidateId(int id)
        {
            return id > 0;
        }
    }
}