using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Threading.Tasks;
using KanbanBoard.Helpers;
using KanbanBoard.Models;
using KanbanBoard.Services;
using KanbanBoard.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KanbanBoard.Controllers
{
    public class Email
    {
        public string To { get; set; }
        public string Cc { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
    }
    
    [Route("api/helpers")]
    public class HelpersController : Controller
    {
        private readonly MailService mailService = new MailService();
        private readonly EmailConfiguration emailConfiguration;
        private readonly IUserService userService;

        public HelpersController(EmailConfiguration emailConfiguration, ConnectionStringConfiguration connectionStringConfiguration)
        {
            this.emailConfiguration = emailConfiguration;
            userService = new UserService(connectionStringConfiguration);
        }

        [HttpPost]
        [Route("mail")]
        public async Task<OkResult> SendMail([FromBody] Email email)
        {
            SmtpClient smtpClient = new SmtpClient(emailConfiguration.SmtpServer, emailConfiguration.Port);
            smtpClient.UseDefaultCredentials = false;
            smtpClient.Credentials = new NetworkCredential(emailConfiguration.Username, emailConfiguration.Password);
            smtpClient.EnableSsl = true;
            
            await smtpClient.SendMailAsync(mailService.CreateMail(email, emailConfiguration.From));
            return Ok();
        }

        [HttpPost]
        [Route("file")]
        public IActionResult Upload([FromForm] IFormCollection formCollection)
        {
            int.TryParse(formCollection["user"], out int userId);
            IFormFile file = formCollection.Files.First();
            string folderName = Path.Combine("Resources", "Images");
            string pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

            if (file.Length > 0)
            {
                string fileName = CreateFileName(userId, ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"'));
                if (fileName == String.Empty)
                {
                    return BadRequest();
                }
                string fullPath = Path.Combine(pathToSave, fileName);
                string savedPath = Path.Combine(folderName, fileName);
                
                DeleteExistingFilesForUser(userId, pathToSave);

                using (FileStream stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }
                
                return Ok(new { path = savedPath });
            }

            return BadRequest();
        }

        private string CreateFileName(int userId, string oldFileName)
        {
            User user = userService.GetById(userId);
            if (user == null)
            {
                return String.Empty;
            }
            
            int index = oldFileName.LastIndexOf('.');
            string type = oldFileName.Substring(index);

            return "user_" + user.Username + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + "_" + user.Id + type;
        }

        private void DeleteExistingFilesForUser(int userId, string path)
        {
            List<string> files = Directory.GetFiles(path).ToList().FindAll(x => x.Contains(userId + "."));
            foreach (string file in files)
            {
                System.IO.File.Delete(file);
            }
        }
    }
}