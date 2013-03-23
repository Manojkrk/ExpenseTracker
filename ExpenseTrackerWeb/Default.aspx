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
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->

        <!-- This code is taken from http://twitter.github.com/bootstrap/examples/hero.html -->

        <form id="form1" runat="server">
            <asp:HiddenField runat="server" ID="hfUserName" />
            <asp:HiddenField runat="server" ID="hfPassword" />
            <asp:Button ID="btnPostback" style="display: none" runat="server" OnClick="btnPostback_Click"/>
        </form>
        <div>
            <table cellspacing="0" cellpadding="1" style="border-collapse: collapse;" id="expenseTrackerLogin">
                <tbody>
                    <tr>
                        <td>
                            <form onsubmit=" javascript:asdasd(); ">
                                <table cellpadding="0">
                                    <tbody>
                                        <tr>
                                            <td align="center" colspan="2">Log In</td>
                                        </tr>
                                        <tr>
                                            <td align="right">
                                                <label for="txtUsername">Email</label>
                                            </td>
                                            <td>
                                                <input type="text" id="txtUsername" name="expenseTrackerLogin$UserName" />
                                                <span style="visibility: hidden;" title="User Name is required." id="expenseTrackerLogin_UserNameRequired">*</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="right"><label for="txtPassword">Password:</label>

                                            </td>
                                            <td>
                                                <input type="password" id="txtPassword" name="expenseTrackerLogin$Password" />
                                                <span style="visibility: hidden;" title="Password is required." id="expenseTrackerLogin_PasswordRequired">*</span>
                                            </td>
                                        </tr>
                                        <%--<tr>
                                            <td align="center" style="color: Red;" colspan="2">Your login attempt was not successful. Please try again.</td>
                                        </tr>--%>
                                        <tr>
                                            <td align="right" colspan="2">
                                                <button type="submit" id="btnLogin" disabled="disabled">Sign In</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </td>
                    </tr>
                </tbody></table>
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