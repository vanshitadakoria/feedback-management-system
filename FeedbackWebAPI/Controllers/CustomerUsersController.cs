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
    public class CustomerUsersController : ControllerBase
    {
        private readonly FeedbackDbContext _context;

        public CustomerUsersController(FeedbackDbContext context)
        {
            _context = context;
        }

        // GET: api/CustomerUsers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerUser>>> GetCustomerUsers()
        {
            return await _context.CustomerUsers
                .Include(ca => ca.CustomerAdmin)
                .ToListAsync();
        }

        // GET: api/CustomerUsers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerUser>> GetCustomerUser(int id)
        {
            var customerUser = await _context.CustomerUsers
                .Include(ca => ca.CustomerAdmin)                
                .Include(ca => ca.QuestionnaireAssignments)     //Added on 17-05-2024    
                    .ThenInclude(q => q.Questionnaire)
                    .ThenInclude(q => q.QuestionnaireQuestions)
                    .ThenInclude(q => q.Question)
                    .ThenInclude(q => q.QuestionCategory)
                .FirstAsync(cu => cu.CustomerUserId == id);

            if (customerUser == null)
            {
                return NotFound();
            }

            return customerUser;
        }

        // PUT: api/CustomerUsers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomerUser(int id, CustomerUser customerUser)
        {
            if (id != customerUser.CustomerUserId)
            {
                return BadRequest();
            }

            _context.Entry(customerUser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerUserExists(id))
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

        // POST: api/CustomerUsers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CustomerUser>> PostCustomerUser(CustomerUser customerUser)
        {
            _context.CustomerUsers.Add(customerUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCustomerUser", new { id = customerUser.CustomerUserId }, customerUser);
        }

        // DELETE: api/CustomerUsers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomerUser(int id)
        {
            var customerUser = await _context.CustomerUsers.FindAsync(id);
            if (customerUser == null)
            {
                return NotFound();
            }

            _context.CustomerUsers.Remove(customerUser);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpGet("byAdmin/{customerAdminId}")]
        public async Task<ActionResult<IEnumerable<CustomerUser>>> GetCustomerUsersByAdmin(int customerAdminId)
        {
            var customerUsers = await _context.CustomerUsers
                .Where(cu => cu.CustomerAdminId == customerAdminId)
                .ToListAsync();

            if (customerUsers == null || !customerUsers.Any())
            {
                return NotFound("No customer users found for the specified customer admin.");
            }

            return Ok(customerUsers);
        }


        //Added on 04-06-2024 For CustomerUser and CustomerAdmin Login
        [HttpGet("login")]
        public async Task<ActionResult<dynamic>> Login(string customerTokenId, string password)
        {
            // Validate CustomerAdmin by token
            var customerAdmin = await _context.CustomerAdmins
                .FirstOrDefaultAsync(ca => ca.CustomerTokenId == customerTokenId && ca.Password == password);

            if (customerAdmin != null)
            {
                return Ok(new { UserType = "Admin", User = customerAdmin });
            }
            else
            {
                // CustomerAdmin not found, check CustomerUsers
                var customerUser = await _context.CustomerUsers
                    .FirstOrDefaultAsync(cu => cu.CustomerUserTokenId == customerTokenId && cu.Password == password);

                if (customerUser == null)
                {
                    return Unauthorized("Invalid token or password");
                }

                return Ok(new { UserType = "User", User = customerUser });

            }
        }


        [HttpPut("updateStatus/{id}")]
        public async Task<IActionResult> UpdateCustomerUserStatus(int id, [FromBody] string status)
        {
            var customerUser = await _context.CustomerUsers.FindAsync(id);
            if (customerUser == null)
            {
                return NotFound();
            }

            customerUser.Status = status;
            _context.Entry(customerUser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerUserExists(id))
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

        private bool CustomerUserExists(int id)
        {
            return _context.CustomerUsers.Any(e => e.CustomerUserId == id);
        }
    }
}
