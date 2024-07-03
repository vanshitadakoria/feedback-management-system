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
    public class RegisteredEndUsersController : ControllerBase
    {
        private readonly FeedbackDbContext _context;

        public RegisteredEndUsersController(FeedbackDbContext context)
        {
            _context = context;
        }

        // GET: api/RegisteredEndUsers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RegisteredEndUser>>> GetRegisteredEndUsers()
        {
            return await _context.RegisteredEndUsers.ToListAsync();
        }

        // GET: api/RegisteredEndUsers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RegisteredEndUser>> GetRegisteredEndUser(int id)
        {
            var registeredEndUser = await _context.RegisteredEndUsers.FindAsync(id);

            if (registeredEndUser == null)
            {
                return NotFound();
            }

            return registeredEndUser;
        }

        // PUT: api/RegisteredEndUsers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRegisteredEndUser(int id, RegisteredEndUser registeredEndUser)
        {

            //var dob = DateOnly.Parse(registeredEndUser.DateOfBirth.Value.ToString("yyyy-MM-dd"));
            //registeredEndUser.DateOfBirth = dob;
            if (id != registeredEndUser.EndUserId)
            {
                return BadRequest();
            }

            _context.Entry(registeredEndUser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RegisteredEndUserExists(id))
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

        // POST: api/RegisteredEndUsers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RegisteredEndUser>> PostRegisteredEndUser(CustomEndUser customEndUser)
        {
            var dob = new DateOnly(customEndUser.year,customEndUser.month,customEndUser.day);

            RegisteredEndUser registeredEndUser = new RegisteredEndUser
            {
                Firstname = customEndUser.Firstname, 
                Lastname = customEndUser.Lastname, 
                ContactNo = customEndUser.ContactNo,
                DateOfBirth = dob,
                Password = customEndUser.Password,
                EmailId = customEndUser.EmailId,
            };

            _context.RegisteredEndUsers.Add(registeredEndUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRegisteredEndUser", new { id = registeredEndUser.EndUserId }, registeredEndUser);
        }

        // DELETE: api/RegisteredEndUsers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRegisteredEndUser(int id)
        {
            var registeredEndUser = await _context.RegisteredEndUsers.FindAsync(id);
            if (registeredEndUser == null)
            {
                return NotFound();
            }

            _context.RegisteredEndUsers.Remove(registeredEndUser);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RegisteredEndUserExists(int id)
        {
            return _context.RegisteredEndUsers.Any(e => e.EndUserId == id);
        }
    }
}
