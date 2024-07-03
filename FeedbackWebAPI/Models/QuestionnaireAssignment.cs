using System;
using System.Collections.Generic;

namespace FeedbackWebAPI.Models;

public partial class QuestionnaireAssignment
{
    public int AssignmentId { get; set; }

    public int QuestionnaireId { get; set; }

    public int CustomerUserId { get; set; }

    public int CustomerAdminId { get; set; }

    public DateOnly? AssignmentDate { get; set; }

    public string? Status { get; set; } 

    public virtual CustomerAdmin? CustomerAdmin { get; set; }

    public virtual CustomerUser? CustomerUser { get; set; } 

    public virtual Questionnaire? Questionnaire { get; set; } 
}
