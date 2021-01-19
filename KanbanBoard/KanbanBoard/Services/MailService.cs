using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using KanbanBoard.Controllers;
using KanbanBoard.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

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

            mailMessage.Body = email.Text;
            mailMessage.Subject = email.Subject;
            mailMessage.BodyEncoding = Encoding.UTF8;
            mailMessage.SubjectEncoding = Encoding.UTF8;

            return mailMessage;
        }
    }
}