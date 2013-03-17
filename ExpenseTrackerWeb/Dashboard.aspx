<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Dashboard.aspx.cs" Inherits="Manoj.ExpenseTracker.Web.Dashboard" %>
<%@ Register src="Usercontrols/BalanceList.ascx" tagPrefix="exp" tagName="BalanceList" %>
<%@ Register src="Usercontrols/TransacList.ascx" tagPrefix="exp" tagName="TransacList" %>
<%@ Register src="Usercontrols/EditTransac.ascx" tagPrefix="exp" tagName="EditTransac" %>
<!DOCTYPE html>
<html>
    <head runat="server">
        <title>Expense Tracker</title>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width" />

        <style>
            body {
                padding-bottom: 40px;
                padding-top: 60px;
            }

            .hidden, .dialog { display: none; }
        </style>
        <link rel="stylesheet" href="initializr/css/bootstrap-responsive.css" />
        <link href="initializr/css/bootstrap.css" rel="stylesheet" type="text/css" />
        <link href="styles/common.css" rel="stylesheet" type="text/css" />
        <link href="styles/expensesUI/jquery-ui-1.10.1.custom.css" rel="stylesheet" type="text/css" />
        <script src="scripts/vendor/modernizr-2.6.2-respond-1.1.0.min.js"> </script>
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->

        <!-- This code is taken from http://twitter.github.com/bootstrap/examples/hero.html -->

        <form id="form1" runat="server">
            <div class="exp-PageWidth">
                <div>
                    <h1>Expense Tracker</h1>
                </div>
                <div>
                    <div class="exp-fullWidth">
                        <div class="exp-alignRight">
                            <label class="exp-inline">Welcome </label>
                            <asp:Label ID="lblUserName" runat="server"></asp:Label>
                            <asp:LinkButton id="lnkSignOut" runat="server" OnClick="lnkSignOut_Click">Sign off</asp:LinkButton>
                        </div>
                    </div>
                    <div class="exp-fullWidth">
                        <div class="exp-alignRight">
                            <asp:DropDownList runat="server" ID="ddlProfile" data-bind="value: currentProfileId"/>
                            <button id="btnManageProfile">Manage Profile</button>
                        </div>
                    </div>
                    <div class="exp-balanceSection">
                        <exp:BalanceList ID="BalanceList1" runat="server" />
                    </div>
                    <div class="exp-mainContent">
                        <button id="btnNewTransac" type="button" data-bind="click: openNewTransacDialog, enable: enableNewTransac">New Transaction</button>
                        <exp:TransacList ID="TransacList1" runat="server" />
                    </div>
                </div>
                <exp:EditTransac ID="EditTransac1" runat="server"/>
            </div>
        </form>
        
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"> </script>
        <script>
            window.jQuery || document.write('<script src="scripts/vendor/jquery-1.9.1.min.js"><\/script>')
        </script>
        
        <script src="scripts/vendor/jquery.tmpl.min.js"> </script>
        <script src="scripts/vendor/bootstrap.js"> </script>
        
        <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.1/jquery-ui.js"> </script>
        <script>
            window.jQuery.ui || document.write('<script src="scripts/vendor/jquery-ui-1.10.1.custom.js"><\/script>')
        </script>
        <script src="scripts/vendor/knockout-2.2.1.js"> </script>
        
        <script src="scripts/ExpenseTracker.js"> </script>
    </body>
</html>