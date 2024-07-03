using System;
using System.Collections.Generic;

namespace FeedbackWebAPI.Models;

public partial class QuestionnaireQuestionBank
{
    public int QuestionnaireQuestionBankId { get; set; }

    public int QuestionnaireBankId { get; set; }

    public int QuestionBankId { get; set; }

    public int SuperAdminId { get; set; }

    public int SerialNo { get; set; }

    public string? Status { get; set; } 

    public virtual QuestionBank? QuestionBank { get; set; } 

    public virtual QuestionnaireBank? QuestionnaireBank { get; set; } 

    public virtual SuperAdmin? SuperAdmin { get; set; } 
}
