using System;
using System.Web;

namespace Manoj.ExpenseTracker.Core
{
    public static class SessionHelper
    {
        public static int UserId
        {
            get { return Convert.ToInt32(HttpContext.Current.Session["UserId"] ?? 0); }
            set { HttpContext.Current.Session["UserId"] = value; }
        }

        public static string Nounce
        {
            get { return Convert.ToString(HttpContext.Current.Session["Nounce"]); }
            set
            {
                if (value != null)
                {
                    HttpContext.Current.Session["Nounce"] = value;
                }
                else
                {
                    HttpContext.Current.Session.Remove("Nounce");
                }
            }
        }
    }
}