using System;
using System.Globalization;
using System.Web;
using System.Web.UI.WebControls;
using Manoj.ExpenseTracker.Core;

namespace Manoj.ExpenseTracker.Web
{
    public partial class Dashboard : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (SessionHelper.UserId == 0)
            {
                Response.Redirect("Default.aspx", true);
                return;
            }
            if (SessionHelper.UserId == 1)
            {
                lblUserName.Text = "Admin";
            }
            var profiles = ExpenseTrackerController.GetProfiles(SessionHelper.UserId);
            ddlProfile.Items.Clear();
            foreach (var profile in profiles)
            {
                ddlProfile.Items.Add(new ListItem(profile.Name, profile.Id.ToString(CultureInfo.InvariantCulture)));
            }
            ddlProfile.Items.Add(new ListItem("New Profile...", "-1"));
        }

        protected void lnkSignOut_Click(object sender, EventArgs e)
        {
            Session.Abandon();
            Response.Redirect("Default.aspx", true);
        }
    }
}