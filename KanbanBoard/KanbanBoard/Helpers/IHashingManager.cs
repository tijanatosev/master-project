namespace KanbanBoard.Helpers
{
    public interface IHashingManager
    {
        (string, string) HashPassword(string password, int id);
        
        byte[] StringToByteArray(string text);

        string ByteArrayToString(byte[] text);
    }
}