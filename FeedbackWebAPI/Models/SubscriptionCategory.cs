using System;
using System.Collections.Generic;

namespace FeedbackWebAPI.Models;
public partial class SubscriptionCategory
{
    public int SubscriptionCategoryId { get; set; }

    public string SubscriptionCategoryName { get; set; } = null!;

    public int MaxCustomerUsers { get; set; }

    public int MaxResponses { get; set; }

    public string? Status { get; set; } 

    public virtual ICollection<CustomerAdmin> CustomerAdmins { get; set; } = new List<CustomerAdmin>();
}
