using System;
using System.Collections.Generic;

namespace FeedbackWebAPI.Models;

public partial class Questionnaire
{
    public int QuestionnaireId { get; set; }

    public string QuestionnaireTitle { get; set; } = null!;

    public int CustomerAdminId { get; set; }

    public string? Status { get; set; }

    public virtual CustomerAdmin? CustomerAdmin { get; set; } 

    public virtual ICollection<FeedbackMaster> FeedbackMasters { get; set; } = new List<FeedbackMaster>();

    public virtual ICollection<QuestionnaireAssignment> QuestionnaireAssignments { get; set; } = new List<QuestionnaireAssignment>();

    public virtual ICollection<QuestionnaireQuestion> QuestionnaireQuestions { get; set; } = new List<QuestionnaireQuestion>();
}
