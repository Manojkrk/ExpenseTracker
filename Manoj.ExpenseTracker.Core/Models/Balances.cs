using System.Collections.Generic;

namespace Manoj.ExpenseTracker.Core.Models
{
    public class Balances
    {
        public Balances()
        {
            BalanceList = new List<Balance>();
        }
        
        public List<Balance> BalanceList { get; set; }

        public decimal TotalBalance { get; set; }
    }
}
