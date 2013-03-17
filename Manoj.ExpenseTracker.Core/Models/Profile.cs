using System.Data;

namespace Manoj.ExpenseTracker.Core.Models
{
    public class Profile
    {
        public Profile(DataRow row)
        {
            Id = (int) row["profileId"];
            Name = row["profileName"].ToString();
        }

        public int Id { get; set; }

        public string Name { get; set; }
    }
}
