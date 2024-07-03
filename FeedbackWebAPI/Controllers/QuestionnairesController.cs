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
    public class QuestionnairesController : ControllerBase
    {
        private readonly FeedbackDbContext _context;

        public QuestionnairesController(FeedbackDbContext context)
        {
            _context = context;
        }

        // GET: api/Questionnaires
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Questionnaire>>> GetQuestionnaires()
        {
            return await _context.Questionnaires
                .Include(ca => ca.CustomerAdmin)
                .Include(q => q.QuestionnaireQuestions)
                .Include(q => q.FeedbackMasters)
                .Include(q => q.QuestionnaireAssignments)
                .ToListAsync();
        }

        // GET: api/Questionnaires/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Questionnaire>> GetQuestionnaire(int id)
        {
            var questionnaire = await _context.Questionnaires
                .Include(ca => ca.CustomerAdmin)        
                .Include(q => q.QuestionnaireQuestions).ThenInclude(q => q.Question).ThenInclude(q => q.QuestionCategory)   //Added
                .Include(q => q.FeedbackMasters)
                .Include(q => q.QuestionnaireAssignments)
                .FirstAsync(q => q.QuestionnaireId == id);

            if (questionnaire == null)
            {
                return NotFound();
            }

            return questionnaire;
        }

        // PUT: api/Questionnaires/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuestionnaire(int id, Questionnaire questionnaire)
        {
            if (id != questionnaire.QuestionnaireId)
            {
                return BadRequest();
            }

            _context.Entry(questionnaire).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionnaireExists(id))
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

        // POST: api/Questionnaires
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Questionnaire>> PostQuestionnaire(Questionnaire questionnaire)
        {
            _context.Questionnaires.Add(questionnaire);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuestionnaire", new { id = questionnaire.QuestionnaireId }, questionnaire);
        }

        // DELETE: api/Questionnaires/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestionnaire(int id)
        {
            var questionnaire = await _context.Questionnaires.FindAsync(id);
            if (questionnaire == null)
            {
                return NotFound();
            }

            _context.Questionnaires.Remove(questionnaire);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //Added on 10-05-2024

        // GET: api/getQuestionnaireByCustomerId/5
        [HttpGet("questionnaireByCustomerId/{customerid}")]
        public async Task<ActionResult<Questionnaire>> GetQuestionnaireByCustomerId(int customerid)
        {
            var questionnaire = await _context.Questionnaires
                .Include(ca => ca.CustomerAdmin)
                .Include(q => q.QuestionnaireQuestions).ThenInclude(q => q.Question).ThenInclude(q => q.QuestionCategory)   //Added
                .Include(q => q.FeedbackMasters)
                .Include(q => q.QuestionnaireAssignments)
                .FirstAsync(q => q.CustomerAdminId == customerid );

            if (questionnaire == null)
            {
                return NotFound();
            }

            return questionnaire;
        }



        [HttpGet("questionnairesByCustomerAdminId/{customerId}")]
        public async Task<ActionResult<IEnumerable<Questionnaire>>> GetQuestionnairesByCustomerAdminId(int customerId)
        {
            return await _context.Questionnaires
                .Include(ca => ca.CustomerAdmin)
                .Include(q => q.QuestionnaireQuestions)
                .Include(q => q.FeedbackMasters)
                .Include(q => q.QuestionnaireAssignments)
                .Where(q => q.CustomerAdminId == customerId)
                .ToListAsync();
        }


        [HttpPut("updateStatus/{id}")]
        public async Task<IActionResult> UpdateQuestionnaireStatus(int id, [FromBody] string status)
        {
            var questionnaire = await _context.Questionnaires.FindAsync(id);
            if (questionnaire == null)
            {
                return NotFound();
            }

            questionnaire.Status = status;
            _context.Entry(questionnaire).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionnaireExists(id))
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

        private bool QuestionnaireExists(int id)
        {
            return _context.Questionnaires.Any(e => e.QuestionnaireId == id);
        }
    }
}
