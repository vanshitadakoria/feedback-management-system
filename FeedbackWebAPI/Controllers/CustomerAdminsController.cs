using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FeedbackWebAPI.Models;
using System.Text.Json.Serialization;
using System.Text.Json;
using FeedbackWebAPI.Services;

namespace FeedbackWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerAdminsController : ControllerBase
    {
        private readonly FeedbackDbContext _context;
        private readonly PasswordService _passwordService;

        public CustomerAdminsController(FeedbackDbContext context)
        {
            _context = context;
            _passwordService = new PasswordService();
        }

        // GET: api/CustomerAdmins
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerAdmin>>> GetCustomerAdmins()
        {
            return await _context.CustomerAdmins
                .Include(o => o.OrganizationNature)
                .Include(s => s.SubscriptionCategory)
                //.ThenInclude(c => c.CustomerAdmins)
                .Include(s => s.QuestionnaireQuestions)
                //.Include(s => s.QuestionnaireAssignments)
                .Include(s => s.Questionnaires)
                .Include(s => s.Questions)
                //.Include(cu => cu.CustomerUsers)
                .ToListAsync();
        }

        // GET: api/CustomerAdmins/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerAdmin>> GetCustomerAdmin(int id)
        {
            var customerAdmin = await _context.CustomerAdmins
                .Include(o => o.OrganizationNature)
                .Include(s => s.SubscriptionCategory)
                //.ThenInclude(c => c.CustomerAdmins)
                .Include(s => s.QuestionnaireQuestions)
                .Include(s => s.QuestionnaireAssignments)
                .Include(s => s.Questionnaires)
                .Include(s => s.Questions)
                .Include(cu => cu.CustomerUsers)
                .FirstAsync(ca => ca.CustomerAdminId == id);
            if (customerAdmin == null)
            {
                return NotFound();
            }
            return customerAdmin;
        }

        //Added on 10-04-2024

        // GET: api/CustomerAdminByEmailId/
        [HttpGet("customeradminByemailid/")]
        public async Task<ActionResult<CustomerAdmin>> GetCustomerAdminByEmailId(string emailId)
        {
            var customerAdmin = await _context.CustomerAdmins
                .Include(o => o.OrganizationNature)
                .Include(s => s.SubscriptionCategory)
                //.ThenInclude(c => c.CustomerAdmins)
                .Include(s => s.QuestionnaireQuestions)
                .Include(s => s.QuestionnaireAssignments)
                .Include(s => s.Questionnaires)
                .Include(s => s.Questions)
                .Include(cu => cu.CustomerUsers)
                .FirstAsync(ca => ca.OfficialEmailId == emailId);
            if (customerAdmin == null)
            {
                return NotFound();
            }
            return customerAdmin;
        }

        //END



        // PUT: api/CustomerAdmins/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomerAdmin(int id, CustomerAdmin customerAdmin)
        {
            if (id != customerAdmin.CustomerAdminId)
            {
                return BadRequest();
            }

            _context.Entry(customerAdmin).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerAdminExists(id))
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

        // POST: api/CustomerAdmins
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CustomerAdmin>> PostCustomerAdmin(CustomerAdmin customerAdmin)
        {
            //var organizationNature = await _context.OrganizationNatures.FindAsync(customerAdmin.OrganizationNatureId);
            //var subscriptionCategory = await _context.SubscriptionCategories.FindAsync(customerAdmin.SubscriptionCategoryId);

            //if (organizationNature == null || subscriptionCategory == null)
            //{
            //    return NotFound("OrganizationNature or SubscriptionCategory is not found.");
            //}

            //customerAdmin.OrganizationNature = organizationNature;
            //customerAdmin.SubscriptionCategory = subscriptionCategory;

            //organizationNature.CustomerAdmins.Add(customerAdmin);
            //subscriptionCategory.CustomerAdmins.Add(customerAdmin);

            // Hash the password before saving
            customerAdmin.Password = _passwordService.HashPassword(customerAdmin.Password);

            _context.CustomerAdmins.Add(customerAdmin);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCustomerAdmin", new { id = customerAdmin.CustomerAdminId }, customerAdmin);
        }

        // DELETE: api/CustomerAdmins/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomerAdmin(int id)
        {
            var customerAdmin = await _context.CustomerAdmins.FindAsync(id);
            if (customerAdmin == null)
            {
                return NotFound();
            }

            _context.CustomerAdmins.Remove(customerAdmin);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("updateStatus/{id}")]
        public async Task<IActionResult> UpdateCustomerAdminsStatus(int id, [FromBody] string status)
        {
            var customerAdmins = await _context.CustomerAdmins.FindAsync(id);
            if (customerAdmins == null)
            {
                return NotFound();
            }

            customerAdmins.Status = status;
            _context.Entry(customerAdmins).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerAdminExists(id))
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

        private bool CustomerAdminExists(int id)
        {
            return _context.CustomerAdmins.Any(e => e.CustomerAdminId == id);
        }
    }
}
