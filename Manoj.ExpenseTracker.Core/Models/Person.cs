using System.Data;

namespace Manoj.ExpenseTracker.Core.Models
{
    public class Person
    {
        public Person()
        {
        }

        public Person(DataRow row)
        {
            Id = (int) row["personId"];
            Name = row["personName"].ToString();
            IsActive = (bool) row["active"];
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
    }
}