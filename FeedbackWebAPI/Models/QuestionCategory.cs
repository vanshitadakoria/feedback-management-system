using System;
using System.Collections.Generic;

namespace FeedbackWebAPI.Models;

public partial class QuestionCategory
{
    public int QuestionCategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public string? Status { get; set; }

    public virtual ICollection<QuestionBank> QuestionBanks { get; set; } = new List<QuestionBank>();

    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
}
