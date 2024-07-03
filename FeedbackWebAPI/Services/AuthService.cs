using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FeedbackWebAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace FeedbackWebAPI.Services
{
    public class AuthService
    {
        private readonly FeedbackDbContext _dbContext;
        private readonly IConfiguration _configuration;
        private readonly PasswordHasher<object> _passwordHasher;
        


        public AuthService(FeedbackDbContext dbContext,IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            _passwordHasher = new PasswordHasher<object>();
        }

        public bool AuthenticateCustomerAdmin(string tokenId, string password)
        {
            var admin = _dbContext.CustomerAdmins.FirstOrDefault(a => a.CustomerTokenId == tokenId);
            //return admin != null && admin.Password == password;
            if (admin == null)
                return false;
            var verificationResult = _passwordHasher.VerifyHashedPassword(null, admin.Password, password);
            return verificationResult == PasswordVerificationResult.Success;
        }

        public bool AuthenticateCustomerUser(string tokenId, string password)
        {
            var user = _dbContext.CustomerUsers.FirstOrDefault(u => u.CustomerUserTokenId == tokenId);
            return user != null && user.Password == password;

            //if (user == null)
            //    return false;

            //var verificationResult = _passwordHasher.VerifyHashedPassword(null, user.Password, password);
            //return verificationResult == PasswordVerificationResult.Success;
        }

        public bool AuthenticateSuperAdmin(string tokenId, string password)
        {
            var user = _dbContext.SuperAdmins.FirstOrDefault(s => s.EmailId == tokenId);
            return user != null && user.Password == password;
            //if (user == null)
            //    return false;
            //var verificationResult = _passwordHasher.VerifyHashedPassword(null, user.Password, password);
            //return verificationResult == PasswordVerificationResult.Success;
        }

        public string GenerateToken(string customerId, string userType)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration.GetValue<string>("Secret"));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                new Claim("userId", customerId),
                new Claim("role", userType)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
