using System;
using System.Collections.Generic;

namespace FeedbackWebAPI.Models;

public partial class FeedbackDetail
{
    public int FeedbackDetailsId { get; set; }

    public int FeedBackMasterId { get; set; }

    public int QuestionId { get; set; }

    public int ResponseRating { get; set; }

    public virtual FeedbackMaster? FeedBackMaster { get; set; }

    public virtual Question? Question { get; set; } 
}
