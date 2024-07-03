using System;
using System.Collections.Generic;

namespace FeedbackWebAPI.Models;
public partial class OrganizationNature
{
    public int OrganizationNatureId { get; set; }

    public string NatureName { get; set; } = null!;

    public virtual ICollection<CustomerAdmin> CustomerAdmins { get; set; } = new List<CustomerAdmin>();
}
