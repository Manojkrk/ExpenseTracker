using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace Manoj.ExpenseTracker.Core.Models
{
    public class Transac
    {
        
        public Transac()
        {
            PersonIds = new List<int>();
        }

        public Transac(DataRow transacRow, IEnumerable<DataRow> transacPersonRows)
        {
            Id = transacRow.GetValue<int>("transacId");
            Date = transacRow.GetValue<DateTime>("tDate");
            Description = transacRow.GetValue<string>("tDesc");
            Amount = transacRow.GetValue<decimal>("amount");
            IsActive = transacRow.GetValue<bool>("active");
            PersonIds = transacPersonRows.Select(tpr => tpr.GetValue<int>("personId")).ToList();
        }

        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public Decimal Amount { get; set; }
        public List<int> PersonIds { get; set; }
        public bool IsActive { get; set; }
    }
}
