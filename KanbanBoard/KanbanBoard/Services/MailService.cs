using System.Net.Mail;
using System.Text;
using KanbanBoard.Controllers;

namespace KanbanBoard.Services
{
    public class MailService
    {
        public MailMessage CreateMail(Email email, string from)
        {
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress(from);
            mailMessage.To.Add(email.To);

            if (!string.IsNullOrEmpty(email.Cc))
            {
                mailMessage.CC.Add(email.Cc);
            }

            mailMessage.Body = email.Content;
            mailMessage.Subject = email.Subject;
            mailMessage.BodyEncoding = Encoding.UTF8;
            mailMessage.SubjectEncoding = Encoding.UTF8;

            return mailMessage;
        }
    }
}