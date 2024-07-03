using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FeedbackWebAPI.Models;

namespace FeedbackWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionnaireBanksController : ControllerBase
    {
        private readonly FeedbackDbContext _context;

        public QuestionnaireBanksController(FeedbackDbContext context)
        {
            _context = context;
        }

        // GET: api/QuestionnaireBanks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuestionnaireBank>>> GetQuestionnaireBanks()
        {
            return await _context.QuestionnaireBanks
                .Include(sa => sa.SuperAdmin)
                .Include(q => q.QuestionnaireQuestionBanks).ThenInclude(qb => qb.QuestionBank)   //Changed on 9-05-2024

                .ToListAsync();

        }

        // GET: api/QuestionnaireBanks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<QuestionnaireBank>> GetQuestionnaireBank(int id)
        {
            var questionnaireBank = await _context.QuestionnaireBanks
                .Include(sa => sa.SuperAdmin)               
                .Include(q => q.QuestionnaireQuestionBanks).ThenInclude(qb => qb.QuestionBank).ThenInclude(c => c.QuestionCategory)        //Changed on 9-05-2024
                .FirstAsync(qb => qb.QuestionnaireBankId == id);

            if (questionnaireBank == null)
            {
                return NotFound();
            }

            return questionnaireBank;
        }

        // PUT: api/QuestionnaireBanks/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuestionnaireBank(int id, QuestionnaireBank questionnaireBank)
        {
            if (id != questionnaireBank.QuestionnaireBankId)
            {
                return BadRequest();
            }

            _context.Entry(questionnaireBank).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionnaireBankExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/QuestionnaireBanks
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<QuestionnaireBank>> PostQuestionnaireBank(QuestionnaireBank questionnaireBank)
        {
            _context.QuestionnaireBanks.Add(questionnaireBank);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuestionnaireBank", new { id = questionnaireBank.QuestionnaireBankId }, questionnaireBank);
        }

        // DELETE: api/QuestionnaireBanks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestionnaireBank(int id)
        {
            var questionnaireBank = await _context.QuestionnaireBanks.FindAsync(id);
            if (questionnaireBank == null)
            {
                return NotFound();
            }

            _context.QuestionnaireBanks.Remove(questionnaireBank);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        //Added on 24-06-2024

        [HttpPut("updateStatus/{id}")]
        public async Task<IActionResult> UpdateQuestionnaireBankStatus(int id, [FromBody] string status)
        {
            var questionnaireBank = await _context.QuestionnaireBanks.FindAsync(id);
            if (questionnaireBank == null)
            {
                return NotFound();
            }

            questionnaireBank.Status = status;
            _context.Entry(questionnaireBank).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionnaireBankExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<QuestionnaireBank>>> GetActiveQuestionnaireBanks()
        {
            return await _context.QuestionnaireBanks
                .Include(sa => sa.SuperAdmin)
                .Include(q => q.QuestionnaireQuestionBanks).ThenInclude(qb => qb.QuestionBank)   //Changed on 9-05-2024
                .Where(qb => qb.Status == "active")
                .ToListAsync();
        }

        //End
        private bool QuestionnaireBankExists(int id)
        {
            return _context.QuestionnaireBanks.Any(e => e.QuestionnaireBankId == id);
        }
    }
}
