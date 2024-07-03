using System;
using System.Collections.Generic;

namespace FeedbackWebAPI.Models;

public partial class QuestionnaireQuestion
{
    public int QuestionnaireQuestionId { get; set; }

    public int QuestionnaireId { get; set; }

    public int QuestionId { get; set; }

    public int CustomerAdminId { get; set; }

    public int SerialNo { get; set; }

    public string? Status { get; set; }

    public virtual CustomerAdmin? CustomerAdmin { get; set; }

    public virtual Question? Question { get; set; } 

    public virtual Questionnaire? Questionnaire { get; set; } 
}
