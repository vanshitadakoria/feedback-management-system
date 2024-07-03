using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FeedbackWebAPI.Models;
using FeedbackWebAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace FeedbackWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly FeedbackDbContext _context;
        //private readonly JwtService _jwtService;


        public AuthController(FeedbackDbContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        [HttpPost("login")]
        public IActionResult Login(LoginModel model)
        {
            if (_authService.AuthenticateSuperAdmin(model.CustomerTokenId, model.Password))
            {
                var user = _context.SuperAdmins.FirstOrDefault(a => a.EmailId == model.CustomerTokenId);
                var token = _authService.GenerateToken(model.CustomerTokenId, "SuperAdmin");
                return Ok(new { token, user });
            }

            if (_authService.AuthenticateCustomerAdmin(model.CustomerTokenId, model.Password))
            {
                var user = _context.CustomerAdmins.FirstOrDefault(a => a.CustomerTokenId == model.CustomerTokenId);
                var token = _authService.GenerateToken(model.CustomerTokenId, "CustomerAdmin");
                return Ok(new { token,user });
            }

            if (_authService.AuthenticateCustomerUser(model.CustomerTokenId, model.Password))
            {
                var user = _context.CustomerUsers.FirstOrDefault(a => a.CustomerUserTokenId == model.CustomerTokenId);
                var token = _authService.GenerateToken(model.CustomerTokenId, "CustomerUser");
                return Ok(new { token,user });
            }

            return Unauthorized();
        }

        
    }
}
