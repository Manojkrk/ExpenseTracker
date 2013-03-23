<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Manoj.ExpenseTracker.Web.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
    <head runat="server">
        <title>Expense Tracker</title>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width" />

        <link rel="stylesheet" href="initializr/css/bootstrap.min.css" />
        <style>
            body {
                padding-bottom: 40px;
                padding-top: 60px;
            }
        </style>
        <link href="initializr/css/bootstrap-responsive.css" rel="stylesheet" type="text/css" />
        <link href="initializr/css/bootstrap.css" rel="stylesheet" type="text/css" />
        <link href="styles/expensesUI/jquery-ui-1.10.1.custom.css" rel="stylesheet" type="text/css" />
        <link href="styles/common.css" rel="stylesheet" type="text/css" />
    </head>
    <body>
        <form id="form1" runat="server">
            <asp:HiddenField runat="server" ID="hfUserName" />
            <asp:HiddenField runat="server" ID="hfPassword" />
            <asp:Button ID="btnPostback" style="display: none" runat="server" OnClick="btnPostback_Click"/>
        </form>
        <div class="loginContainer">
            <form onsubmit=" javascript:asdasd(); ">
                <div>
                    <h2>Sign In</h2>
                    <div>
                        <label class="loginLabel" for="txtUsername">Email </label>
                        <span>
                            <input type="text" id="txtUsername" name="expenseTrackerLogin$UserName" />
                            <span style="visibility: hidden;" title="User Name is required." id="expenseTrackerLogin_UserNameRequired">*</span>
                        </span>
                    </div>
                    <div>
                        <label class="loginLabel" for="txtPassword">Password </label>
                        <span>
                            <input type="password" id="txtPassword" name="expenseTrackerLogin$Password" />
                            <span style="visibility: hidden;" title="Password is required." id="expenseTrackerLogin_PasswordRequired">*</span>
                        </span>
                    </div>
                    <div>
                        <button type="submit" id="btnLogin" disabled="disabled">Sign In</button>
                    </div>
                </div>
            </form>
        </div>
        
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"> </script>
        <script>
            window.jQuery || document.write('<script src="scripts/vendor/jquery-1.9.1.min.js"><\/script>')
        </script>
        
        <script src="scripts/vendor/jquery.tmpl.min.js"> </script>
        <script src="scripts/vendor/bootstrap.js"> </script>
        
        <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.1/jquery-ui.min.js"> </script>
        <script>
            window.jQuery.ui || document.write('<script src="scripts/vendor/jquery-ui-1.10.1.custom.min.js"><\/script>')
        </script>
        <script src="scripts/vendor/RSA.min.js"> </script>
        <script>
            var param = <%= GetPublicKey() %>;

        </script>
        <script src="scripts/login.js"> </script>
    </body>
</html>