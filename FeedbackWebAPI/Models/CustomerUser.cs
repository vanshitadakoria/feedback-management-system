using System;
using System.Collections.Generic;

namespace FeedbackWebAPI.Models;

public partial class CustomerUser
{
    public int CustomerUserId { get; set; }

    public string CustomerUserTokenId { get; set; } = null!;

    public string CustomerUserName { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int CustomerAdminId { get; set; }

    public string? Status { get; set; }

    public virtual CustomerAdmin? CustomerAdmin { get; set; }

    public virtual ICollection<FeedbackMaster> FeedbackMasters { get; set; } = new List<FeedbackMaster>();

    public virtual ICollection<QuestionnaireAssignment> QuestionnaireAssignments { get; set; } = new List<QuestionnaireAssignment>();
}
