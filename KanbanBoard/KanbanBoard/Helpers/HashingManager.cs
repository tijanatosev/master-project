using System.Security.Cryptography;
using System.Text;

namespace KanbanBoard.Helpers
{
    public class HashingManager : IHashingManager
    {
        private readonly SHA512CryptoServiceProvider sha512CryptoServiceProvider;

        public HashingManager()
        {
            sha512CryptoServiceProvider = new SHA512CryptoServiceProvider();
        }


        public string HashPassword(string password)
        {
            byte[] hashedPassword = sha512CryptoServiceProvider.ComputeHash(StringToByteArray(password));
            return ByteArrayToString(hashedPassword);
        }

        public byte[] StringToByteArray(string text)
        {
            return Encoding.UTF8.GetBytes(text);
        }

        public string ByteArrayToString(byte[] text)
        {
            StringBuilder stringBuilder = new StringBuilder();
            
            for (int i = 0; i < text.Length; i++)
            {
                stringBuilder.Append(text[i].ToString("x2"));
            }
            
            return stringBuilder.ToString();
        }
    }
}