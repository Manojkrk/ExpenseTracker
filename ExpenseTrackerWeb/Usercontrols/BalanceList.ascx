<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="BalanceList.ascx.cs" Inherits="Manoj.ExpenseTracker.Web.Usercontrols.BalanceList" %>
<div id="divBalances">
    <table class="table table-bordered hidden" data-bind="css: { hidden: hideBalances }">
        <caption>Balances</caption>
        <tbody data-bind="foreach: persons">
            <tr data-bind="css: { 'exp-thresholdLow': $root.getPersonBalance(Id) < 0 }">
                <td data-bind="text: Name"></td>
                <td class="exp-alignRight">
                    &#8377;
                    <!-- ko text: $root.getPersonBalance(Id) --><!-- /ko -->
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