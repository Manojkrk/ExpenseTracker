<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="TransacList.ascx.cs" Inherits="Manoj.ExpenseTracker.Web.Usercontrols.TransacList" %>
<table id="tableTransac" class="table table-bordered table-striped table-hover hidden" data-bind="css: { hidden: hideTransacs }">
    <thead>
        <tr>
            <th class="ui-tabs-active ui-state-active clickable" data-bind="sort: { list: transacs, property: 'Date', descendingFirst: true }">
                <a href="javascript:void(0)">Date</a>
            </th>
            <th class="ui-tabs-active ui-state-active clickable" data-bind="sort: { list: transacs, property: 'Type' }">
                <a href="javascript:void(0)">Type</a>
            </th>
            <th class="ui-tabs-active ui-state-active clickable" data-bind="sort: { list: transacs, property: 'Description' }">
                <a href="javascript:void(0)">Description</a>
            </th>
            <th class="ui-tabs-active ui-state-active clickable" data-bind="sort: { list: transacs, property: 'Persons' }">
                <a href="javascript:void(0)">Persons</a>
            </th>
            <th class="ui-tabs-active ui-state-active clickable" data-bind="sort: { list: transacs, property: 'Amount' }">
                <a href="javascript:void(0)">Amount</a>
            </th>
            <th></th>
        </tr>
    </thead>
    <tbody id="tbodyTransac" data-bind="foreach: transacs">
        <tr class="editable" data-bind="click: $root.openEditTransac">
            <td data-bind="text: $.datepicker.formatDate('dd/mm/yy', Date)"></td>
            <td data-bind="text: (Amount > 0) ? 'Input' : 'Expense'"></td>
            <td data-bind="text: Description"></td>
            <td data-bind="text: getPersonNames(PersonIds)"></td>
            <td class="exp-alignRight">
                &#8377;
                <!-- ko text: Math.abs(Amount) --><!-- /ko -->
            </td>
            <td>
                <a class="exp-deleteIcon" href="javascript:void(0);" data-bind="click: $root.deleteTransac">
                    <img src="/styles/images/delete.png" alt="Delete"/>
                </a>
            </td>
        </tr>
    </tbody>
</table>