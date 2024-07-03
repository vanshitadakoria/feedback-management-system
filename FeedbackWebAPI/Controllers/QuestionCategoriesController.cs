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
    public class QuestionCategoriesController : ControllerBase
    {
        private readonly FeedbackDbContext _context;

        public QuestionCategoriesController(FeedbackDbContext context)
        {
            _context = context;
        }

        // GET: api/QuestionCategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuestionCategory>>> GetQuestionCategories()
        {
            return await _context.QuestionCategories
                .Include(q => q.Questions)
                .Include(q => q.QuestionBanks)
                .ToListAsync();
        }

        // GET: api/QuestionCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<QuestionCategory>> GetQuestionCategory(int id)
        {
            var questionCategory = await _context.QuestionCategories
                .Include(q => q.Questions)
                .Include(q => q.QuestionBanks)
                .FirstAsync(qc => qc.QuestionCategoryId == id);

            if (questionCategory == null)
            {
                return NotFound();
            }

            return questionCategory;
        }

        // PUT: api/QuestionCategories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuestionCategory(int id, QuestionCategory questionCategory)
        {
            if (id != questionCategory.QuestionCategoryId)
            {
                return BadRequest();
            }

            _context.Entry(questionCategory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionCategoryExists(id))
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

        // POST: api/QuestionCategories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<QuestionCategory>> PostQuestionCategory(QuestionCategory questionCategory)
        {
            _context.QuestionCategories.Add(questionCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuestionCategory", new { id = questionCategory.QuestionCategoryId }, questionCategory);
        }

        // DELETE: api/QuestionCategories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestionCategory(int id)
        {
            var questionCategory = await _context.QuestionCategories.FindAsync(id);
            if (questionCategory == null)
            {
                return NotFound();
            }

            _context.QuestionCategories.Remove(questionCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //Added on 13-05-2024

        // GET: api/QuestionCategories
        [HttpGet("CategoryByName/{name}")]
        public async Task<ActionResult<IEnumerable<QuestionCategory>>> GetQuestionCategoryByName(string name)
        {
            return await _context.QuestionCategories
                .Include(q => q.Questions)
                .Include(q => q.QuestionBanks)
                .Where(c => c.CategoryName == name)
                .ToListAsync();
        }

        //End

        private bool QuestionCategoryExists(int id)
        {
            return _context.QuestionCategories.Any(e => e.QuestionCategoryId == id);
        }
    }
}
