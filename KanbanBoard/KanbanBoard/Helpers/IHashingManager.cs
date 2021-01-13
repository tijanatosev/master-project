namespace KanbanBoard.Helpers
{
    public interface IHashingManager
    {
        string HashPassword(string password);
        
        byte[] StringToByteArray(string text);

        string ByteArrayToString(byte[] text);
    }
}