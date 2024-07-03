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
    public class QuestionnaireQuestionBanksController : ControllerBase
    {
        private readonly FeedbackDbContext _context;

        public QuestionnaireQuestionBanksController(FeedbackDbContext context)
        {
            _context = context;
        }

        // GET: api/QuestionnaireQuestionBanks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuestionnaireQuestionBank>>> GetQuestionnaireQuestionBanks()
        {
            return await _context.QuestionnaireQuestionBanks
                .Include(q => q.QuestionnaireBank)
                .Include(q => q.QuestionBank)           //Changed on 9-05-2024
                .Include(q => q.SuperAdmin)
                .ToListAsync();
        }

        // GET: api/QuestionnaireQuestionBanks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<QuestionnaireQuestionBank>> GetQuestionnaireQuestionBank(int id)
        {
            var questionnaireQuestionBank = await _context.QuestionnaireQuestionBanks
                .Include(q => q.QuestionnaireBank)
                .Include(q => q.QuestionBank)
                .Include(q => q.SuperAdmin)
                .FirstAsync(q => q.QuestionnaireQuestionBankId == id);

            if (questionnaireQuestionBank == null)
            {
                return NotFound();
            }

            return questionnaireQuestionBank;
        }

        // PUT: api/QuestionnaireQuestionBanks/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuestionnaireQuestionBank(int id, QuestionnaireQuestionBank questionnaireQuestionBank)
        {
            if (id != questionnaireQuestionBank.QuestionnaireQuestionBankId)
            {
                return BadRequest();
            }

            _context.Entry(questionnaireQuestionBank).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionnaireQuestionBankExists(id))
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

        // POST: api/QuestionnaireQuestionBanks
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<QuestionnaireQuestionBank>> PostQuestionnaireQuestionBank(QuestionnaireQuestionBank questionnaireQuestionBank)
        {
            _context.QuestionnaireQuestionBanks.Add(questionnaireQuestionBank);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuestionnaireQuestionBank", new { id = questionnaireQuestionBank.QuestionnaireQuestionBankId }, questionnaireQuestionBank);
        }

        // DELETE: api/QuestionnaireQuestionBanks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestionnaireQuestionBank(int id)
        {
            var questionnaireQuestionBank = await _context.QuestionnaireQuestionBanks.FindAsync(id);
            if (questionnaireQuestionBank == null)
            {
                return NotFound();
            }

            _context.QuestionnaireQuestionBanks.Remove(questionnaireQuestionBank);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool QuestionnaireQuestionBankExists(int id)
        {
            return _context.QuestionnaireQuestionBanks.Any(e => e.QuestionnaireQuestionBankId == id);
        }

        //Added on 22-05-2023

        // DELETE: api/QuestionnaireQuestions/DeleteByQuestionId/5
        [HttpDelete("DeleteByQuestionBankId/{questionBankId}")]
        public async Task<IActionResult> DeleteQuestionnaireQuestionByQuestionId(int questionBankId)
        {
            var questionnaireQuestionBank = await _context.QuestionnaireQuestionBanks.FirstAsync(q => q.QuestionBankId == questionBankId);
            if (questionnaireQuestionBank == null)
            {
                return NotFound();
            }

            _context.QuestionnaireQuestionBanks.Remove(questionnaireQuestionBank);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("GetByQuestionBankId/{questionBankId}")]
        public async Task<ActionResult<QuestionnaireQuestionBank>> GetQuestionnaireQuestionBankByQuestionBankId(int questionBankId)
        {
            var questionnaireQuestionBank = await _context.QuestionnaireQuestionBanks
                .Include(q => q.QuestionnaireBank)
                .Include(q => q.QuestionBank)
                .Include(q => q.SuperAdmin)
                .FirstAsync(q => q.QuestionBankId == questionBankId);

            if (questionnaireQuestionBank == null)
            {
                return NotFound();
            }

            return questionnaireQuestionBank;
        }

        //End

    }
}
