using System;
using System.Security.Cryptography;
using System.Text;
using KanbanBoard.PersistenceManagers.Interfaces;

namespace KanbanBoard.Helpers
{
    public class HashingManager : IHashingManager
    {
        private readonly SHA512CryptoServiceProvider sha512CryptoServiceProvider;
        private readonly IUserPersistenceManager userPersistenceManager;

        public HashingManager(IUserPersistenceManager userPersistenceManager)
        {
            this.userPersistenceManager = userPersistenceManager;
            sha512CryptoServiceProvider = new SHA512CryptoServiceProvider();
        }

        public (string, string) HashPassword(string password, int id)
        {
            string salt = GetSalt(id);
            byte[] hashedPassword = sha512CryptoServiceProvider.ComputeHash(StringToByteArray(password + salt));
            return (ByteArrayToString(hashedPassword), salt);
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

        private string GetSalt(int id)
        {
            if (id > 0)
            {
                return userPersistenceManager.LoadSalt(id);
            }
            
            Guid guid = Guid.NewGuid();
            string salt = Convert.ToBase64String(guid.ToByteArray());
            salt = salt.Replace("=","");

            return salt;
        }
    }
}