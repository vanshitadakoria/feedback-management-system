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
    public class SuperAdminsController : ControllerBase
    {
        private readonly FeedbackDbContext _context;

        public SuperAdminsController(FeedbackDbContext context)
        {
            _context = context;
        }

        // GET: api/SuperAdmins
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SuperAdmin>>> GetSuperAdmins()
        {
            return await _context.SuperAdmins
                .Include(qb => qb.QuestionnaireBanks)
                .Include(q => q.QuestionBanks)
                .Include(q => q.QuestionnaireQuestionBanks)
                .ToListAsync();
        }

        // GET: api/SuperAdmins/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SuperAdmin>> GetSuperAdmin(int id)
        {
            var superAdmin = await _context.SuperAdmins
                .Include(qb => qb.QuestionnaireBanks)
                .Include(q => q.QuestionBanks)
                .FirstAsync(sa => sa.SuperAdminId == id);

            if (superAdmin == null)
            {
                return NotFound();
            }

            return superAdmin;
        }

        // PUT: api/SuperAdmins/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSuperAdmin(int id, SuperAdmin superAdmin)
        {
            if (id != superAdmin.SuperAdminId)
            {
                return BadRequest();
            }

            _context.Entry(superAdmin).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SuperAdminExists(id))
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

        // POST: api/SuperAdmins
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SuperAdmin>> PostSuperAdmin(SuperAdmin superAdmin)
        {
            _context.SuperAdmins.Add(superAdmin);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSuperAdmin", new { id = superAdmin.SuperAdminId }, superAdmin);
        }

        // DELETE: api/SuperAdmins/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSuperAdmin(int id)
        {
            var superAdmin = await _context.SuperAdmins.FindAsync(id);
            if (superAdmin == null)
            {
                return NotFound();
            }

            _context.SuperAdmins.Remove(superAdmin);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SuperAdminExists(int id)
        {
            return _context.SuperAdmins.Any(e => e.SuperAdminId == id);
        }
    }
}
