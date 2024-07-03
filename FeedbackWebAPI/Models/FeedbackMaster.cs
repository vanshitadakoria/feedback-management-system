using System;
using System.Collections.Generic;

namespace FeedbackWebAPI.Models;

public partial class FeedbackMaster
{
    public int FeedbackMasterId { get; set; }

    public DateTime? FeedbackDate { get; set; }

    public string? PersonName { get; set; }

    public string? PersonContactNo { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public int QuestionnaireId { get; set; }

    public int? CustomerUserId { get; set; }

    public int? EndUserId { get; set; }

    public virtual CustomerUser? CustomerUser { get; set; }

    public virtual RegisteredEndUser? EndUser { get; set; }

    public virtual ICollection<FeedbackDetail> FeedbackDetails { get; set; } = new List<FeedbackDetail>();

    public virtual Questionnaire? Questionnaire { get; set; }
}
