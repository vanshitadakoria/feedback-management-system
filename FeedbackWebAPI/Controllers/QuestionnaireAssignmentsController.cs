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
    public class QuestionnaireAssignmentsController : ControllerBase
    {
        private readonly FeedbackDbContext _context;

        public QuestionnaireAssignmentsController(FeedbackDbContext context)
        {
            _context = context;
        }

        // GET: api/QuestionnaireAssignments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuestionnaireAssignment>>> GetQuestionnaireAssignments()
        {
            return await _context.QuestionnaireAssignments
                .Include(qa => qa.Questionnaire)
                .Include(qa => qa.CustomerAdmin)
                .Include(qa => qa.CustomerUser)
                .ToListAsync();
        }

        // GET: api/QuestionnaireAssignments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<QuestionnaireAssignment>> GetQuestionnaireAssignment(int id)
        {
            var questionnaireAssignment = await _context.QuestionnaireAssignments
                .Include(qa => qa.Questionnaire)
                .Include(qa => qa.CustomerAdmin)
                .Include(qa => qa.CustomerUser)
                .FirstAsync(qa => qa.AssignmentId == id);

            if (questionnaireAssignment == null)
            {
                return NotFound();
            }

            return questionnaireAssignment;
        }

        // PUT: api/QuestionnaireAssignments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuestionnaireAssignment(int id, QuestionnaireAssignment questionnaireAssignment)
        {
            if (id != questionnaireAssignment.AssignmentId)
            {
                return BadRequest();
            }

            _context.Entry(questionnaireAssignment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionnaireAssignmentExists(id))
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

        // POST: api/QuestionnaireAssignments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<QuestionnaireAssignment>> PostQuestionnaireAssignment(QuestionnaireAssignment questionnaireAssignment)
        {
            questionnaireAssignment.AssignmentDate = DateOnly.FromDateTime(DateTime.Now);
            _context.QuestionnaireAssignments.Add(questionnaireAssignment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuestionnaireAssignment", new { id = questionnaireAssignment.AssignmentId }, questionnaireAssignment);
        }

        // DELETE: api/QuestionnaireAssignments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestionnaireAssignment(int id)
        {
            var questionnaireAssignment = await _context.QuestionnaireAssignments.FindAsync(id);
            if (questionnaireAssignment == null)
            {
                return NotFound();
            }

            _context.QuestionnaireAssignments.Remove(questionnaireAssignment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool QuestionnaireAssignmentExists(int id)
        {
            return _context.QuestionnaireAssignments.Any(e => e.AssignmentId == id);
        }

        //Added on 23-05-2024

        [HttpGet("QuestionnairesByCustomerUserId/{customerUserId}")]
        public async Task<ActionResult<IEnumerable<QuestionnaireAssignment>>> GetQuestionnaireAssignmentsByCustomerUserId(int customerUserId)
        {
            return await _context.QuestionnaireAssignments
                .Include(qa => qa.Questionnaire)
                .Include(qa => qa.CustomerAdmin)
                .Include(qa => qa.CustomerUser)
                .Where(qa => qa.CustomerUserId == customerUserId)
                .ToListAsync();
        }
    }
}
