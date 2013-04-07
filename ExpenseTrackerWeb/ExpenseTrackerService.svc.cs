using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using System.Threading;
using Manoj.ExpenseTracker.Core;
using Manoj.ExpenseTracker.Core.Models;
using Manoj.ExpenseTracker.Web.Usercontrols;

namespace Manoj.ExpenseTracker.Web
{
    [ServiceContract]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    public class ExpenseTrackerService
    {
        // To use HTTP GET, add [WebGet] attribute. (Default ResponseFormat is WebMessageFormat.Json)
        // To create an operation that returns XML,
        //     add [WebGet(ResponseFormat=WebMessageFormat.Xml)],
        //     and include the following line in the operation body:
        //         WebOperationContext.Current.OutgoingResponse.ContentType = "text/xml";
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json)]
        public Balances GetBalances(int profileId)
        {
            if (profileId == 0)
            {
                throw new ArgumentException("profileId");
            }
            return ExpenseTrackerController.GetBalances(profileId);
        }

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json)]
        public List<Transac> GetTransacs(int profileId)
        {
            if (profileId == 0)
            {
                throw new ArgumentException("profileId");
            }
            var transacs = ExpenseTrackerController.GetTransacs(profileId);
            return transacs;
        }

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json)]
        public List<Person> GetPersons(int profileId)
        {
            if (profileId == 0)
            {
                throw new ArgumentException("profileId");
            }
            return ExpenseTrackerController.GetPersons(profileId);
        }
        
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json)]
        public int InsertTransac(int profileId, Transac transac)
        {
            if (profileId == 0)
            {
                throw new ArgumentException("profileId");
            }
            if (!transac.PersonIds.Where(id => id > 0).Any() || transac.Date < DateTime.Now.AddYears(-2) ||
                string.IsNullOrWhiteSpace(transac.Description))
            {
                throw new ArgumentException("invalid data", "transac");
            }
            return ExpenseTrackerController.InsertTransac(profileId, transac);
        }

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json)]
        public bool UpdateTransac(Transac transac)
        {
            if (transac.Id == 0 || !transac.PersonIds.Where(id => id > 0).Any() || transac.Date < DateTime.Now.AddYears(-2) ||
                string.IsNullOrWhiteSpace(transac.Description))
            {
                throw new ArgumentException("invalid data", "transac");
            }
            return ExpenseTrackerController.UpdateTransac(transac);
        }

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json)]
        public bool DeleteTransac(int transacId)
        {
            return ExpenseTrackerController.DeleteTransac(transacId);
        }

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json)]
        public int CreateProfile(string profileName)
        {
            return ExpenseTrackerController.CreateProfile(profileName);
        }
    }
}
