namespace KanbanBoard.Helpers
{
    public class ValidationService : IValidationService
    {
        public bool ValidateId(int id)
        {
            return id > 0;
        }
    }
}