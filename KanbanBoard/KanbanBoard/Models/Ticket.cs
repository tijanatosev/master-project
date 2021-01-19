﻿using System;

namespace KanbanBoard.Models
{
    public class Ticket
    {
        public int Id { get; set; }
        public string Title { get; set; } 
        public string Description { get; set; } 
        public string Creator { get; set; } 
        public int StoryPoints { get; set; } 
        public string Status { get; set; } 
        public DateTime DateCreated { get; set; } 
        public int AssignedTo { get; set; }
        public int? BoardId { get; set; } 
        public int? ColumnId { get; set; } 
    }
}