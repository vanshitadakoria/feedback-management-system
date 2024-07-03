using FeedbackWebAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FeedbackWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountController : ControllerBase
    {
        private readonly FeedbackDbContext _context;

        public CountController(FeedbackDbContext context)
        {
            _context = context;
        }

        // GET: api/<CountController>
        [HttpGet("QuestionnaireBanksCount")]
        public async Task<ActionResult<int>> GetQuestionnaireBanksCount()
        {
            var count = _context.QuestionnaireBanks.Count();
            return count;

        }

        [HttpGet("QuestionBanksCount")]
        public async Task<ActionResult<int>> GetQuestionBanksCount()
        {
            var count = _context.QuestionBanks.Count();
            return count;
        }

        [HttpGet("CustomerAdminsCount")]
        public async Task<ActionResult<int>> GetCustomerAdminsCount()
        {
            var count = _context.CustomerAdmins.Count();
            return count;
        }

        [HttpGet("CustomerUsersCount")]
        public async Task<ActionResult<int>> GetCustomerUsersCount()
        {
            var count = _context.CustomerUsers.Count();
            return count;
        }




    }
}
