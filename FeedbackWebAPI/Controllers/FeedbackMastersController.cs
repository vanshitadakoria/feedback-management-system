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
    public class FeedbackMastersController : ControllerBase
    {
        private readonly FeedbackDbContext _context;

        public FeedbackMastersController(FeedbackDbContext context)
        {
            _context = context;
        }

        // GET: api/FeedbackMasters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FeedbackMaster>>> GetFeedbackMasters()
        {
            return await _context.FeedbackMasters
                .Include(f => f.FeedbackDetails)
                .Include(f => f.EndUser)
                .Include(f => f.CustomerUser)
                .Include(f => f.Questionnaire)
                .ToListAsync();
        }

        // GET: api/FeedbackMasters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FeedbackMaster>> GetFeedbackMaster(int id)
        {
            var feedbackMaster = await _context.FeedbackMasters
                .Include(f => f.FeedbackDetails).ThenInclude(q => q.Question).ThenInclude(q => q.QuestionCategory)
                .Include(f => f.EndUser)
                .Include(f => f.CustomerUser)
                .Include(f => f.Questionnaire)
                .FirstAsync(f => f.FeedbackMasterId == id);

            if (feedbackMaster == null)
            {
                return NotFound();
            }

            return feedbackMaster;
        }

        // PUT: api/FeedbackMasters/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFeedbackMaster(int id, FeedbackMaster feedbackMaster)
        {
            if (id != feedbackMaster.FeedbackMasterId)
            {
                return BadRequest();
            }

            _context.Entry(feedbackMaster).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FeedbackMasterExists(id))
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

        // POST: api/FeedbackMasters
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<FeedbackMaster>> PostFeedbackMaster(FeedbackMaster feedbackMaster)
        {
            feedbackMaster.FeedbackDate = DateTime.Now;
            _context.FeedbackMasters.Add(feedbackMaster);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFeedbackMaster", new { id = feedbackMaster.FeedbackMasterId }, feedbackMaster);
        }

        // DELETE: api/FeedbackMasters/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFeedbackMaster(int id)
        {
            var feedbackMaster = await _context.FeedbackMasters.FindAsync(id);
            if (feedbackMaster == null)
            {
                return NotFound();
            }

            _context.FeedbackMasters.Remove(feedbackMaster);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("GetFeedbackMastersByCustomerUser/{customerUserId}")]
        public async Task<ActionResult<IEnumerable<FeedbackMaster>>> GetFeedbackMastersByCustomerUser(int customerUserId)
        {
            return await _context.FeedbackMasters
                .Include(f => f.CustomerUser)
                .Where(f => f.CustomerUserId == customerUserId)
                .ToListAsync();
        }


        [HttpGet("GetFeedbackMastersByCustomerAdmin/{customerAdminId}")]
        public async Task<ActionResult<IEnumerable<FeedbackMaster>>> GetFeedbackMastersByCustomerAdmin(int customerAdminId)
        {
            return await _context.FeedbackMasters
                .Include(f => f.FeedbackDetails).ThenInclude(q => q.Question)
                //.Include(f => f.CustomerUser)
                //.ThenInclude(cu => cu.CustomerAdmin)?
                .Where(f => f.CustomerUser.CustomerAdminId == customerAdminId)
                .ToListAsync();
        }

        private bool FeedbackMasterExists(int id)
        {
            return _context.FeedbackMasters.Any(e => e.FeedbackMasterId == id);
        }


    }
}
