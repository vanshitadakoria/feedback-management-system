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
    public class OrganizationNaturesController : ControllerBase
    {
        private readonly FeedbackDbContext _context;

        public OrganizationNaturesController(FeedbackDbContext context)
        {
            _context = context;
        }

        // GET: api/OrganizationNatures
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrganizationNature>>> GetOrganizationNatures()
        {
            return await _context.OrganizationNatures
                .Include(ca => ca.CustomerAdmins)
                .ToListAsync();
        }

        // GET: api/OrganizationNatures/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrganizationNature>> GetOrganizationNature(int id)
        {
            var organizationNature = await _context.OrganizationNatures
                .Include(ca => ca.CustomerAdmins)
                .FirstAsync(o => o.OrganizationNatureId == id);

            if (organizationNature == null)
            {
                return NotFound();
            }

            return organizationNature;
        }

        // PUT: api/OrganizationNatures/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrganizationNature(int id, OrganizationNature organizationNature)
        {
            if (id != organizationNature.OrganizationNatureId)
            {
                return BadRequest();
            }

            _context.Entry(organizationNature).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrganizationNatureExists(id))
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

        // POST: api/OrganizationNatures
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<OrganizationNature>> PostOrganizationNature(OrganizationNature organizationNature)
        {
            _context.OrganizationNatures.Add(organizationNature);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrganizationNature", new { id = organizationNature.OrganizationNatureId }, organizationNature);
        }

        // DELETE: api/OrganizationNatures/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrganizationNature(int id)
        {
            var organizationNature = await _context.OrganizationNatures.FindAsync(id);
            if (organizationNature == null)
            {
                return NotFound();
            }

            _context.OrganizationNatures.Remove(organizationNature);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrganizationNatureExists(int id)
        {
            return _context.OrganizationNatures.Any(e => e.OrganizationNatureId == id);
        }
    }
}
