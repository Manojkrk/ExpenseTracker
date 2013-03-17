using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Manoj.ExpenseTracker.Core
{
    public static class SessionHelper
    {
        public static int UserId
        {
            get
            {
                return Convert.ToInt32(HttpContext.Current.Session["UserId"] ?? 0);
            }
            set
            {
                HttpContext.Current.Session["UserId"] = value;
            }
        }
    }
}
