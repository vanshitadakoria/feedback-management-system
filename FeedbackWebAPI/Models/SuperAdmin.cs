using System;
using System.Collections.Generic;

namespace FeedbackWebAPI.Models;

public partial class SuperAdmin
{
    public int SuperAdminId { get; set; }

    public string EmailId { get; set; } = null!;

    public string Password { get; set; } = null!;

    public virtual ICollection<QuestionBank> QuestionBanks { get; set; } = new List<QuestionBank>();

    public virtual ICollection<QuestionnaireBank> QuestionnaireBanks { get; set; } = new List<QuestionnaireBank>();

    public virtual ICollection<QuestionnaireQuestionBank> QuestionnaireQuestionBanks { get; set; } = new List<QuestionnaireQuestionBank>();
}
