using System;
using System.Collections.Generic;

namespace FeedbackWebAPI.Models;

public partial class Question
{
    public int QuestionId { get; set; }

    public string QuestionText { get; set; } = null!;

    public int QuestionCategoryId { get; set; }

    public int CustomerAdminId { get; set; }

    public string? Status { get; set; }

    public virtual CustomerAdmin? CustomerAdmin { get; set; } 

    public virtual ICollection<FeedbackDetail> FeedbackDetails { get; set; } = new List<FeedbackDetail>();

    public virtual QuestionCategory? QuestionCategory { get; set; }

    public virtual ICollection<QuestionnaireQuestion> QuestionnaireQuestions { get; set; } = new List<QuestionnaireQuestion>();
}
