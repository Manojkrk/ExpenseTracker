using System;
using System.Web.Script.Serialization;
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

        }

        protected void lnkSignOut_Click(object sender, EventArgs e)
        {
            Session.Abandon();
            Response.Redirect("Default.aspx", true);
        }

        protected string Profiles
        {
            get
            {
                var profiles = ExpenseTrackerController.GetProfiles(SessionHelper.UserId);
                return new JavaScriptSerializer().Serialize(profiles);
            }
        }
    }
}