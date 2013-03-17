<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="BalanceList.ascx.cs" Inherits="Manoj.ExpenseTracker.Web.Usercontrols.BalanceList" %>
<div id="divBalances">
    <table id="tableBalances" class="table table-bordered hidden" data-bind="css: { hidden: hideBalances }">
        <caption>Balances</caption>
        <tbody id="tbodyBalances" data-bind="foreach: balances().BalanceList">
            <tr data-bind="css: { 'exp-thresholdLow': Amount < 0 }">
                <td data-bind="text: Person.Name"></td>
                <td class="exp-alignRight">
                    &#8377;
                    <!-- ko text: Amount --><!-- /ko -->
                </td>
            </tr>
        </tbody>
        <tfoot class="exp-bold">
            <tr>
                <td>Total</td>
                <td class="exp-alignRight">
                    &#8377;
                    <!-- ko text: balances().TotalBalance --><!-- /ko -->
                </td>
            </tr>
        </tfoot>
    </table>
</div>