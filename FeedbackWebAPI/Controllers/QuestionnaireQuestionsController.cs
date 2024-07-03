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
    public class QuestionnaireQuestionsController : ControllerBase
    {
        private readonly FeedbackDbContext _context;

        public QuestionnaireQuestionsController(FeedbackDbContext context)
        {
            _context = context;
        }

        // GET: api/QuestionnaireQuestions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuestionnaireQuestion>>> GetQuestionnaireQuestions()
        {
            return await _context.QuestionnaireQuestions
                .Include(q => q.Questionnaire)
                .Include(q => q.Question)
                .Include(q => q.CustomerAdmin)
                .ToListAsync();
        }

        // GET: api/QuestionnaireQuestions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<QuestionnaireQuestion>> GetQuestionnaireQuestion(int id)
        {
            var questionnaireQuestion = await _context.QuestionnaireQuestions
                .Include(q => q.Questionnaire)
                .Include(q => q.Question)
                .Include(q => q.CustomerAdmin)
                .FirstAsync(q => q.QuestionnaireQuestionId == id);

            if (questionnaireQuestion == null)
            {
                return NotFound();
            }

            return questionnaireQuestion;
        }

        // PUT: api/QuestionnaireQuestions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuestionnaireQuestion(int id, QuestionnaireQuestion questionnaireQuestion)
        {
            if (id != questionnaireQuestion.QuestionnaireQuestionId)
            {
                return BadRequest();
            }

            _context.Entry(questionnaireQuestion).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionnaireQuestionExists(id))
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

        // POST: api/QuestionnaireQuestions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<QuestionnaireQuestion>> PostQuestionnaireQuestion(QuestionnaireQuestion questionnaireQuestion)
        {
            _context.QuestionnaireQuestions.Add(questionnaireQuestion);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuestionnaireQuestion", new { id = questionnaireQuestion.QuestionnaireQuestionId }, questionnaireQuestion);
        }

        // DELETE: api/QuestionnaireQuestions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestionnaireQuestion(int id)
        {
            var questionnaireQuestion = await _context.QuestionnaireQuestions.FindAsync(id);
            if (questionnaireQuestion == null)
            {
                return NotFound();
            }

            _context.QuestionnaireQuestions.Remove(questionnaireQuestion);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        //Added on 13-05-2024

        // DELETE: api/QuestionnaireQuestions/DeleteByQuestionId/5
        [HttpDelete("DeleteByQuestionId/{questionId}")]
        public async Task<IActionResult> DeleteQuestionnaireQuestionByQuestionId(int questionId)
        {
            var questionnaireQuestion = await _context.QuestionnaireQuestions.FirstAsync(q => q.QuestionId == questionId);
            if (questionnaireQuestion == null)
            {
                return NotFound();
            }

            _context.QuestionnaireQuestions.Remove(questionnaireQuestion);
            await _context.SaveChangesAsync();

            return NoContent();
        }



        // DELETE: api/QuestionnaireQuestions/5
        [HttpDelete("DeleteByQuestionnaireId/{questionnaireId}")]
        public async Task<IActionResult> DeleteQuestionnaireQuestionByQuestionnaireId(int questionnaireId)
        {
            var questionnaireQuestion = await _context.QuestionnaireQuestions.FirstAsync(q => q.QuestionnaireId == questionnaireId);
            if (questionnaireQuestion == null)
            {
                return NotFound();
            }

            _context.QuestionnaireQuestions.Remove(questionnaireQuestion);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //End



        // Added on 31-05-2024

        // GET: api/QuestionnaireQuestions/5
        [HttpGet("QuestionnaireQuestion/{questionId}")]
        public async Task<ActionResult<QuestionnaireQuestion>> GetQuestionnaireQuestionByQuestionAndQuestionnaireId(int questionId)
        {
            var questionnaireQuestion = await _context.QuestionnaireQuestions
                .Include(q => q.Questionnaire)
                .Include(q => q.Question)
                .Include(q => q.CustomerAdmin)
                .FirstAsync(q => q.QuestionId == questionId);

            if (questionnaireQuestion == null)
            {
                return NotFound();
            }

            return questionnaireQuestion;
        }


        // End

        private bool QuestionnaireQuestionExists(int id)
        {
            return _context.QuestionnaireQuestions.Any(e => e.QuestionnaireQuestionId == id);
        }
    }
}
