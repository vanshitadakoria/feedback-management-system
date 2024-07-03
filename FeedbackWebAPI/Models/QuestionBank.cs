using System;
using System.Collections.Generic;

namespace FeedbackWebAPI.Models;

public partial class QuestionBank
{
    public int QuestionBankId { get; set; }

    public string QuestionBankText { get; set; } = null!;

    public int QuestionCategoryId { get; set; }

    public int SuperAdminId { get; set; }

    public string? Status { get; set; }

    public virtual QuestionCategory? QuestionCategory { get; set; }

    public virtual ICollection<QuestionnaireQuestionBank> QuestionnaireQuestionBanks { get; set; } = new List<QuestionnaireQuestionBank>();

    public virtual SuperAdmin? SuperAdmin { get; set; }
}
