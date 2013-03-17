using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using Manoj.ExpenseTracker.Core.Models;
using Microsoft.Practices.EnterpriseLibrary.Data;

namespace Manoj.ExpenseTracker.Core
{
    public static class ExpenseTrackerController
    {
        private static Database expDb;

        private static Database Db
        {
            get { return expDb ?? (expDb = DatabaseFactory.CreateDatabase("ExpenseTracker")); }
        }

        public static IEnumerable<Profile> GetProfiles(int userId)
        {
            var dataSet = Db.ExecuteDataSet("Sp_GetProfiles", userId);
            var dataTable = dataSet.Tables[0];
            var profiles = (from DataRow row in dataTable.Rows
                            select new Profile(row));
            return profiles;
        }

        public static List<Person> GetPersons(int profileId)
        {
            var dataSet = Db.ExecuteDataSet("Sp_GetPersons", profileId);
            var dataTable = dataSet.Tables[0];
            var persons = (from DataRow row in dataTable.Rows
                           select new Person(row)
                          ).ToList();
            return persons;
        }

        public static Balances GetBalances(int profileId)
        {
            var persons = GetPersons(profileId);
            var command = Db.GetStoredProcCommand("Sp_GetBalances");
            Db.AddInParameter(command,"profileId", DbType.Int32, profileId);
            Db.AddOutParameter(command,"total", DbType.Currency, 30);
            var dataSet = Db.ExecuteDataSet(command);
            var dataTable = dataSet.Tables[0];
            var balances = new Balances
                {
                    BalanceList = (from person in persons
                                   where person.IsActive
                                   select new Balance
                                       {
                                           Person = person,
                                           Amount = (from DataRow row in dataTable.Rows
                                                     where row.GetValue<int>("personId") == person.Id
                                                     select row.GetValue<decimal>("balance")).SingleOrDefault()
                                       }).ToList(),
                    TotalBalance = Convert.ToDecimal(Db.GetParameterValue(command, "total"))
                };
            return balances;
        }

        public static List<Transac> GetTransacs(int profileId)
        {
            const int count = 1000;
            var dataSet = Db.ExecuteDataSet("Sp_GetLatestTransacs", profileId, count);
            var transacTable = dataSet.Tables[0];
            var transacPersonTable = dataSet.Tables[1];
            var transacs = (from DataRow tRow in transacTable.Rows
                            select new Transac(tRow, transacPersonTable.Select("transacId = " + tRow.GetValue<int>("transacId"))))
                .ToList();
            return transacs;
        }

        internal static T GetValue<T>(this DataRow row, string column)
        {
            return (T) Convert.ChangeType(row[column], typeof (T));
        }

        private static DbCommand GetStoredProcCommandWithTvp(string storedProcedureName, params object[] parameterValues)
        {
            var command = Db.GetStoredProcCommand(storedProcedureName, parameterValues);
            foreach (SqlParameter parameter in command.Parameters)
            {
                if (parameter.SqlDbType == SqlDbType.Structured)
                {
                    var typeNameParts = parameter.TypeName.Split(new Char[] { '.' });
                    if (typeNameParts.Length == 3)
                    {
                        parameter.TypeName = string.Format("{0}.{1}", typeNameParts[1], typeNameParts[2]);
                    }
                }
            }
            return command;
        }

        public static int InsertTransac(int profileId, Transac transac)
        {
            var personIdDt = new DataTable();
            personIdDt.Columns.Add("Id", typeof (int));
            foreach (var personId in transac.PersonIds)
            {
                personIdDt.Rows.Add(personId);
            }
            var command = GetStoredProcCommandWithTvp("Sp_InsertTransac", profileId, transac.Date, transac.Description,
                                                      transac.Amount, personIdDt);
            var transacId = Convert.ToInt32(Db.ExecuteScalar(command));
            return transacId;
        }

        public static bool UpdateTransac(Transac transac)
        {
            var personIdDt = new DataTable();
            personIdDt.Columns.Add("Id", typeof(int));
            foreach (var personId in transac.PersonIds)
            {
                personIdDt.Rows.Add(personId);
            }
            var command = GetStoredProcCommandWithTvp("Sp_UpdateTransac", transac.Id, transac.Date, transac.Description,
                                                      transac.Amount, personIdDt);
            Db.ExecuteNonQuery(command);
            return true;
        }

        public static bool DeleteTransac(int transacId)
        {
            Db.ExecuteNonQuery("Sp_DeleteTransac", transacId);
            return true;
        }

        public static int ValidateUser(string username, string password)
        {
            return Convert.ToInt32(Db.ExecuteScalar("Sp_ValidateUser", username, password));
        }

        public static string GetUserName(int userId)
        {
            throw new NotImplementedException();
        }
    }
}