<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Dashboard.aspx.cs" Inherits="Manoj.ExpenseTracker.Web.Dashboard" %>
<%@ Register src="Usercontrols/BalanceList.ascx" tagPrefix="exp" tagName="BalanceList" %>
<%@ Register src="Usercontrols/TransacList.ascx" tagPrefix="exp" tagName="TransacList" %>
<%@ Register src="Usercontrols/EditTransac.ascx" tagPrefix="exp" tagName="EditTransac" %>
<%@ Register Src="~/Usercontrols/InputBox.ascx" TagPrefix="exp" TagName="InputBox" %>

<!DOCTYPE html>
<html>
    <head runat="server">
        <title>Expense Tracker</title>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width" />

        <style>
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
            <div class="navbar navbar-fixed-top">
                <div class="navbar-inner">
                    <div class="container">
                        <ul class="nav">
                            <li class="active">
                                <a class="brand" href="Dashboard.aspx">Expenses</a>
                            </li>
                            <li><a href="javascript:void(0)" data-bind="click: openNewTransacDialog, enable: enableNewTransac">New Transaction</a></li>
                        </ul>
                        <ul class="nav" data-bind="visible: profiles().length">
                            <li class="dropdown">
                                <a href="#"
                                   class="dropdown-toggle"
                                   data-toggle="dropdown">
                                    <span data-bind="text: currentProfile().Name"></span>
                                    <b class="caret"></b>
                                </a>
                                <ul class="dropdown-menu">
                                    <li><a href="javascript:void(0)">Manage&hellip;</a></li>
                                    <li><div class="dropdown-menu-separator" data-bind="visible: profiles().length > 1"></div></li>
                                    <!-- ko foreach: profiles -->
                                    <li data-bind="visible: $data !== $root.currentProfile()">
                                        <a href="javascript:void(0)" data-bind="text: Name, click: $root.selectProfile"></a>
                                    </li>
                                    <!-- /ko -->
                                    <li><div class="dropdown-menu-separator"></div></li>
                                    <li><a href="javascript:void(0)" data-bind="click: openNewProfileDialog">New&hellip;</a></li>
                                </ul>
                            </li>
                        </ul>
                        <ul class="nav pull-right">
                            <li class="dropdown">
                                <a href="#"
                                   class="dropdown-toggle"
                                   data-toggle="dropdown">
                                    Welcome
                                    <asp:Label ID="lblUserName" runat="server"></asp:Label>
                                    <b class="caret"></b>
                                </a>
                                <ul class="dropdown-menu">
                                    <li>
                                        <asp:LinkButton id="lnkSignOut" runat="server" OnClick="lnkSignOut_Click">Sign off</asp:LinkButton>
                                    </li>
                                </ul>
                            </li>
                        </ul>

                    </div>
                </div>
            </div>
            <div class="exp-PageWidth">
                <div>
                    <div class="exp-balanceSection">
                        <exp:BalanceList runat="server" />
                    </div>
                    <div class="exp-mainContent">
                        <exp:TransacList runat="server" />
                    </div>
                </div>
                <exp:EditTransac runat="server"/>
                <exp:InputBox runat="server" />
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
        
        <script>
            window.JSON || document.write('<script src="scripts/vendor/json2.js"><\/script>');
        </script>

        <script>
            var profiles = <%= Profiles %>;
        </script>
        
        <script src="scripts/ExpenseTracker.js"> </script>
    </body>
</html>