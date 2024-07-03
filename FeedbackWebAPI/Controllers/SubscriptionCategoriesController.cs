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
    public class SubscriptionCategoriesController : ControllerBase
    {
        private readonly FeedbackDbContext _context;

        public SubscriptionCategoriesController(FeedbackDbContext context)
        {
            _context = context;
        }

        // GET: api/SubscriptionCategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubscriptionCategory>>> GetSubscriptionCategories()
        {
            return await _context.SubscriptionCategories
                .Include(ca => ca.CustomerAdmins)
                //.ThenInclude(o => o.OrganizationNature)
                .ToListAsync();
        }

        // GET: api/SubscriptionCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SubscriptionCategory>> GetSubscriptionCategory(int id)
        {
            var subscriptionCategory = await _context.SubscriptionCategories
                .Include(ca => ca.CustomerAdmins)
                //.ThenInclude(o => o.OrganizationNature)
                .FirstAsync(s => s.SubscriptionCategoryId == id);

            if (subscriptionCategory == null)
            {
                return NotFound();
            }

            return subscriptionCategory;
        }

        // PUT: api/SubscriptionCategories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSubscriptionCategory(int id, SubscriptionCategory subscriptionCategory)
        {
            if (id != subscriptionCategory.SubscriptionCategoryId)
            {
                return BadRequest();
            }

            _context.Entry(subscriptionCategory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubscriptionCategoryExists(id))
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

        // POST: api/SubscriptionCategories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SubscriptionCategory>> PostSubscriptionCategory(SubscriptionCategory subscriptionCategory)
        {
            _context.SubscriptionCategories.Add(subscriptionCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSubscriptionCategory", new { id = subscriptionCategory.SubscriptionCategoryId }, subscriptionCategory);
        }

        // DELETE: api/SubscriptionCategories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubscriptionCategory(int id)
        {
            var subscriptionCategory = await _context.SubscriptionCategories.FindAsync(id);
            if (subscriptionCategory == null)
            {
                return NotFound();
            }

            _context.SubscriptionCategories.Remove(subscriptionCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SubscriptionCategoryExists(int id)
        {
            return _context.SubscriptionCategories.Any(e => e.SubscriptionCategoryId == id);
        }
    }
}
