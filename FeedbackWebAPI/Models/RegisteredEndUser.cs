using System;
using System.Collections.Generic;

namespace FeedbackWebAPI.Models;

public partial class RegisteredEndUser
{
    public int EndUserId { get; set; }

    public string? Firstname { get; set; }

    public string? Lastname { get; set; }

    public string EmailId { get; set; } = null!;

    public string ContactNo { get; set; } = null!;

    public DateOnly? DateOfBirth { get; set; }

    public string Password { get; set; } = null!;

    public string? Status { get; set; }

    public virtual ICollection<FeedbackMaster> FeedbackMasters { get; set; } = new List<FeedbackMaster>();
}
