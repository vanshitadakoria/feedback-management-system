using System;
using System.Collections.Generic;

namespace FeedbackWebAPI.Models;

public partial class QuestionnaireBank
{
    public int QuestionnaireBankId { get; set; }

    public string QuestionnaireBankTitle { get; set; } = null!;

    public int SuperAdminId { get; set; }

    public string? Status { get; set; }

    public virtual ICollection<QuestionnaireQuestionBank> QuestionnaireQuestionBanks { get; set; } = new List<QuestionnaireQuestionBank>();

    public virtual SuperAdmin? SuperAdmin { get; set; }
}
