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
    public class QuestionBanksController : ControllerBase
    {
        private readonly FeedbackDbContext _context;

        public QuestionBanksController(FeedbackDbContext context)
        {
            _context = context;
        }

        // GET: api/QuestionBanks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuestionBank>>> GetQuestionBanks()
        {
            return await _context.QuestionBanks
                .Include(qc => qc.QuestionCategory)
                .Include(sa => sa.SuperAdmin)
                .ToListAsync();
        }

        // GET: api/QuestionBanks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<QuestionBank>> GetQuestionBank(int id)
        {
            var questionBank = await _context.QuestionBanks
                .Include(qc => qc.QuestionCategory)
                .Include(sa => sa.SuperAdmin)
                .FirstAsync(q => q.QuestionBankId == id);

            if (questionBank == null)
            {
                return NotFound();
            }

            return questionBank;
        }

        // PUT: api/QuestionBanks/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuestionBank(int id, QuestionBank questionBank)
        {
            if (id != questionBank.QuestionBankId)
            {
                return BadRequest();
            }

            _context.Entry(questionBank).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionBankExists(id))
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

        // POST: api/QuestionBanks
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<QuestionBank>> PostQuestionBank(QuestionBank questionBank)
        {
            _context.QuestionBanks.Add(questionBank);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuestionBank", new { id = questionBank.QuestionBankId }, questionBank);
        }

        // DELETE: api/QuestionBanks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestionBank(int id)
        {
            var questionBank = await _context.QuestionBanks.FindAsync(id);
            if (questionBank == null)
            {
                return NotFound();
            }

            _context.QuestionBanks.Remove(questionBank);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //Added on 9-05-2024

        [HttpGet("questionbycategory/{questionCategoryId}")]
        public async Task<ActionResult<IEnumerable<QuestionBank>>> GetQuestionBankByCategoryId(int questionCategoryId)
        {
            return await _context.QuestionBanks
                .Where(q => q.QuestionCategoryId == questionCategoryId).ToListAsync();
        }

        //End

        private bool QuestionBankExists(int id)
        {
            return _context.QuestionBanks.Any(e => e.QuestionBankId == id);
        }
    }
}
