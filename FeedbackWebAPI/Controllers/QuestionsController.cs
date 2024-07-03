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
    public class QuestionsController : ControllerBase
    {
        private readonly FeedbackDbContext _context;

        public QuestionsController(FeedbackDbContext context)
        {
            _context = context;
        }

        // GET: api/Questions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Question>>> GetQuestions()
        {
            return await _context.Questions
                .Include(q => q.QuestionnaireQuestions)
                .Include(q => q.FeedbackDetails)
                .Include(q => q.CustomerAdmin)
                .Include(q => q.QuestionCategory)
                .ToListAsync();
        }

        // GET: api/Questions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Question>> GetQuestion(int id)
        {
            var question = await _context.Questions
                .Include(q => q.QuestionnaireQuestions)
                .Include(q => q.FeedbackDetails)
                .Include(q => q.CustomerAdmin)
                .Include(q => q.QuestionCategory)
                .FirstAsync(q => q.QuestionId == id);

            if (question == null)
            {
                return NotFound();
            }

            return question;
        }

        // PUT: api/Questions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuestion(int id, Question question)
        {
            if (id != question.QuestionId)
            {
                return BadRequest();
            }

            _context.Entry(question).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionExists(id))
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

        // POST: api/Questions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Question>> PostQuestion(Question question)
        {
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuestion", new { id = question.QuestionId }, question);
        }

        // DELETE: api/Questions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null)
            {
                return NotFound();
            }

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        //Added on 13-05-2024

        [HttpGet("questionbycategory/{questionCategoryId}")]
        public async Task<ActionResult<IEnumerable<Question>>> GetQuestionsByCategoryId(int questionCategoryId)
        {
            return await _context.Questions
                .Include(f => f.FeedbackDetails)
                .Include(f => f.QuestionCategory)
                .Where(q => q.QuestionCategoryId == questionCategoryId).ToListAsync();
        }



        [HttpGet("questionByCategoryId")]
        public async Task<ActionResult<IEnumerable<Question>>> GetQuestionsByCategoryIdAndAdminId(int questionCategoryId,int customerAdminId)
        {
            return await _context.Questions
                .Where(q => q.QuestionCategoryId == questionCategoryId && q.CustomerAdminId == customerAdminId)
                .ToListAsync();
        }

        [HttpPut("updateStatus/{id}")]
        public async Task<IActionResult> UpdateQuestionnaireStatus(int id, [FromBody] string status)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null)
            {
                return NotFound();
            }

            question.Status = status;
            _context.Entry(question).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionExists(id))
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

        //End

        private bool QuestionExists(int id)
        {
            return _context.Questions.Any(e => e.QuestionId == id);
        }
    }
}
