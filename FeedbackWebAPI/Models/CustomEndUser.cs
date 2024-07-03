namespace FeedbackWebAPI.Models
{
    public class CustomEndUser
    { 
        public string? Firstname { get; set; }

        public string? Lastname { get; set; }

        public string EmailId { get; set; } = null!;

        public string ContactNo { get; set; } = null!;
        public int year { get; set; }
        public int month { get; set; }
        public int day { get; set; }
        public string? Password { get; set; }
    }
}
