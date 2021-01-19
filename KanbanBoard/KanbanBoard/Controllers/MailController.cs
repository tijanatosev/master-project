using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using KanbanBoard.Helpers;
using KanbanBoard.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace KanbanBoard.Controllers
{
    public class Email
    {
        public string To { get; set; }
        public string Cc { get; set; }
        public string Subject { get; set; }
        public string Text { get; set; }
    }
    
    [Route("api/mail")]
    public class MailController : Controller
    {
        private readonly MailService mailService = new MailService();
        private readonly EmailConfiguration emailConfiguration;

        public MailController(EmailConfiguration emailConfiguration)
        {
            this.emailConfiguration = emailConfiguration;
        }

        [HttpPost]
        [Route("")]
        public async Task<OkResult> SendMail([FromBody] Email email)
        {
            SmtpClient smtpClient = new SmtpClient(emailConfiguration.SmtpServer, emailConfiguration.Port);
            smtpClient.UseDefaultCredentials = false;
            smtpClient.Credentials = new NetworkCredential(emailConfiguration.Username, emailConfiguration.Password);
            smtpClient.EnableSsl = true;
            
            await smtpClient.SendMailAsync(mailService.CreateMail(email, emailConfiguration.From));
            return Ok();
        }
    }
}