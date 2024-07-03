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
    public class FeedbackDetailsController : ControllerBase
    {
        private readonly FeedbackDbContext _context;

        public FeedbackDetailsController(FeedbackDbContext context)
        {
            _context = context;
        }

        // GET: api/FeedbackDetails
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FeedbackDetail>>> GetFeedbackDetails()
        {
            return await _context.FeedbackDetails
                .Include(f => f.FeedBackMaster)
                .Include(f => f.Question)
                .ToListAsync();
        }

        // GET: api/FeedbackDetails/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FeedbackDetail>> GetFeedbackDetail(int id)
        {
            var feedbackDetail = await _context.FeedbackDetails
                .Include(f => f.FeedBackMaster)
                .Include(f => f.Question)
                .FirstAsync(f => f.FeedbackDetailsId == id);

            if (feedbackDetail == null)
            {
                return NotFound();
            }

            return feedbackDetail;
        }

        // PUT: api/FeedbackDetails/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFeedbackDetail(int id, FeedbackDetail feedbackDetail)
        {
            if (id != feedbackDetail.FeedbackDetailsId)
            {
                return BadRequest();
            }

            _context.Entry(feedbackDetail).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FeedbackDetailExists(id))
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

        // POST: api/FeedbackDetails
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<FeedbackDetail>> PostFeedbackDetail(FeedbackDetail feedbackDetail)
        {
            _context.FeedbackDetails.Add(feedbackDetail);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFeedbackDetail", new { id = feedbackDetail.FeedbackDetailsId }, feedbackDetail);
        }

        // DELETE: api/FeedbackDetails/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFeedbackDetail(int id)
        {
            var feedbackDetail = await _context.FeedbackDetails.FindAsync(id);
            if (feedbackDetail == null)
            {
                return NotFound();
            }

            _context.FeedbackDetails.Remove(feedbackDetail);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        //Added on 04-06-2024
        [HttpGet("ByCustomerUserId/{customerUserId}")]
        public async Task<ActionResult<IEnumerable<FeedbackDetail>>> GetFeedbackDetailsByCustomerUserId(int customerUserId)
        {
            var feedbackDetails = await _context.FeedbackDetails
                .Include(f => f.FeedBackMaster)
                .Include(f => f.Question).ThenInclude(q => q.QuestionCategory)
                .Where(f => f.FeedBackMaster.CustomerUserId == customerUserId)
                .ToListAsync();

            if (feedbackDetails == null || feedbackDetails.Count == 0)
            {
                return NotFound();
            }

            return feedbackDetails;
        }

        [HttpGet("ByCustomerAdminId/{customerAdminId}")]
        public async Task<ActionResult<IEnumerable<FeedbackDetail>>> GetFeedbackDetailsByCustomerAdminId(int customerAdminId)
        {
            var feedbackDetails = await _context.FeedbackDetails
                //.Include(f => f.FeedBackMaster)
                .Include(f => f.Question).ThenInclude(q => q.QuestionCategory)
               .Where(f => f.Question.CustomerAdminId == customerAdminId)
                .ToListAsync();

            if (feedbackDetails == null || feedbackDetails.Count == 0)
            {
                return NotFound();
            }

            return feedbackDetails;
        }

        //End


        private bool FeedbackDetailExists(int id)
        {
            return _context.FeedbackDetails.Any(e => e.FeedbackDetailsId == id);
        }
    }
}
