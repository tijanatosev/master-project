﻿using System.Collections.Generic;
using KanbanBoard.Models;
using KanbanBoard.PersistenceManagers;
using KanbanBoard.PersistenceManagers.Interfaces;
using KanbanBoard.Services.Interfaces;

namespace KanbanBoard.Services
{
    public class ColumnService : IColumnService
    {
        private readonly IColumnPersistenceManager columnPersistenceManager = new ColumnPersistenceManager();
        
        public IEnumerable<Column> GetByBoardId(int boardId)
        {
            if (!ValidateId(boardId))
            {
                return new List<Column>();
            }

            return columnPersistenceManager.LoadByBoardId(boardId);
        }

        public Column GetById(int id)
        {
            if (!ValidateId(id))
            {
                return null;
            }

            return columnPersistenceManager.Load(id);
        }

        public int Add(Column column)
        {
            return columnPersistenceManager.Add(column);
        }

        public void Delete(int id)
        {
            if (!ValidateId(id))
            {
                return;
            }
            
            columnPersistenceManager.Delete(id);
        }

        public bool UpdateColumnOrder(int id, int columnOrder)
        {
            if (!ValidateId(id) || columnPersistenceManager.Load(id) == null)
            {
                return false;
            }

            return columnPersistenceManager.UpdateColumnOrder(id, columnOrder) > 0;
        }
        
        private bool ValidateId(int id)
        {
            return id > 0;
        }
    }
}