using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Caching;
using System.Web.Security;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
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
            hfKey.Value = GetPublicKey();
        }

        protected void expenseTrackerLogin_Authenticate(object sender, AuthenticateEventArgs e)
        {
           // e.Authenticated = expenseTrackerLogin.UserName == "admin" && expenseTrackerLogin.Password == "mnjkmr87";
        }

        protected void expenseTrackerLogin_LoggedIn(object sender, EventArgs e)
        {
            SessionHelper.UserId = 1;
            Response.Redirect("Dashboard.aspx", true);
        }

        private static string GetPublicKey()
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
                HttpRuntime.Cache.Insert("KeyPair", rsa.ToXmlString(true), null, DateTime.Now.AddDays(1), Cache.NoSlidingExpiration);
            }
            var param = rsa.ExportParameters(false);

            var keyToSend = string.Format("{0},{1}", ToHexString(param.Exponent), ToHexString(param.Modulus));
            return keyToSend;
        }

        [WebMethod]
        public static bool ValidateUser(string username, string password)
        {
            // Check request number from this ip is in allowed range
            //if(!ActionValidator.IsValid(ActionValidator.ActionTypeEnum.FirstVisit))
            //    return false;           

            //read Key Pair (Public + Private Key) from Cache
            var domainKey = (string) HttpRuntime.Cache["KeyPair"];

            var rsa = new RSACryptoServiceProvider();
            rsa.FromXmlString(domainKey);
            var decUsername = Encoding.UTF8.GetString(rsa.Decrypt(ToHexByte(username), false));
            var decPassword = Encoding.UTF8.GetString(rsa.Decrypt(ToHexByte(password), false));

            var userId = ExpenseTrackerController.ValidateUser(decUsername, decPassword);
            if(userId != 0)
            {
                SessionHelper.UserId = userId;
                return true;
            }
            return false;
        }

        private static string ToHexString(byte[] byteValue)
        {
            char[] lookup = new[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' };
            int i = 0, p = 0, l = byteValue.Length;
            char[] c = new char[l * 2];
            while (i < l)
            {
                byte d = byteValue[i++];
                c[p++] = lookup[d / 0x10];
                c[p++] = lookup[d % 0x10];
            }
            return new string(c, 0, c.Length);
        }

        private static byte[] ToHexByte(string str)
        {
            byte[] b = new byte[str.Length / 2];
            for (int y = 0, x = 0; x < str.Length; ++y, x++)
            {
                byte c1 = (byte)str[x];
                if (c1 > 0x60) c1 -= 0x57;
                else if (c1 > 0x40) c1 -= 0x37;
                else c1 -= 0x30;
                byte c2 = (byte)str[++x];
                if (c2 > 0x60) c2 -= 0x57;
                else if (c2 > 0x40) c2 -= 0x37;
                else c2 -= 0x30;
                b[y] = (byte)((c1 << 4) + c2);
            }
            return b;
        }
    }
}