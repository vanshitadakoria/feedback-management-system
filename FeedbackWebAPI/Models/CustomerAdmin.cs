using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace FeedbackWebAPI.Models;
public partial class CustomerAdmin
{
    public int CustomerAdminId { get; set; }

    public string CustomerTokenId { get; set; } = null!;

    public string OrganizationName { get; set; } = null!;

    public string OfficialEmailId { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string ContactNo { get; set; } = null!;

    public int? OrganizationNatureId { get; set; }

    public int? SubscriptionCategoryId { get; set; }

    public string? Status { get; set; }

    public virtual ICollection<CustomerUser> CustomerUsers { get; set; } = new List<CustomerUser>();

    public virtual OrganizationNature? OrganizationNature { get; set; }

    public virtual ICollection<QuestionnaireAssignment> QuestionnaireAssignments { get; set; } = new List<QuestionnaireAssignment>();

    public virtual ICollection<QuestionnaireQuestion> QuestionnaireQuestions { get; set; } = new List<QuestionnaireQuestion>();

    public virtual ICollection<Questionnaire> Questionnaires { get; set; } = new List<Questionnaire>();

    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();

    public virtual SubscriptionCategory? SubscriptionCategory { get; set; }
}
