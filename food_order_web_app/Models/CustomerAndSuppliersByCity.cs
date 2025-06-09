using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace food_order_web_app.Models;

[Keyless]
public partial class CustomerAndSuppliersByCity
{
    public string? City { get; set; }

    public string? CompanyName { get; set; }

    public string? ContactName { get; set; }

    public string? Relationship { get; set; }
}
