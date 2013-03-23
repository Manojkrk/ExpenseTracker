using System;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Caching;
using System.Web.Script.Serialization;
using System.Web.UI;
using Manoj.ExpenseTracker.Core;

namespace Manoj.ExpenseTracker.Web
{
    public partial class Default : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (SessionHelper.UserId != 0)
            {
                Response.Redirect("Dashboard.aspx");
            }
        }

        protected static string GetPublicKey()
        {
            var rsa = new RSACryptoServiceProvider();
            //Add Key Pair (Public + Private Key) to Cache to be used by ValidateUser
            var domainKey = (string) HttpRuntime.Cache["KeyPair"];
            if (domainKey != null)
            {
                rsa.FromXmlString(domainKey);
            }
            else
            {
                HttpRuntime.Cache.Insert("KeyPair", rsa.ToXmlString(true), null, DateTime.Now.AddDays(1),
                                         Cache.NoSlidingExpiration);
            }
            var param = rsa.ExportParameters(false);
            return new JavaScriptSerializer().Serialize(new
                {
                    Exponent = LoginController.ToHexString(param.Exponent),
                    Modulus = LoginController.ToHexString(param.Modulus),
                    Nounce = LoginController.GetUniqueKey()
                });
        }

        protected void btnPostback_Click(object sender, EventArgs e)
        {
            if (LoginController.ValidateUser(hfUserName.Value, hfPassword.Value))
            {
                Response.Redirect("Dashboard.aspx");
            }
        }
    }
}