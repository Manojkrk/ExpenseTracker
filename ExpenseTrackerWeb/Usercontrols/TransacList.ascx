<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="TransacList.ascx.cs" Inherits="Manoj.ExpenseTracker.Web.Usercontrols.TransacList" %>
<table id="tableTransac" class="table table-bordered table-striped table-hover hidden" data-bind="css: { hidden: hideTransacs }">
    <thead>
        <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Description</th>
            <th>Persons</th>
            <th>Amount</th>
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
<script id="tmplTransac" type="text/x-jQuery-tmpl">
    <tr class="editable">
        <td>
            ${$.datepicker.formatDate('dd/mm/yy', Date)}
        </td>
        <td>
            {{if Amount > 0}}
            Input
            {{else}}
            Expense
            {{/if}}
        </td>
        <td>
            ${Description}
        </td>
        <td>
            ${getPersonNames(PersonIds)}
        </td>
        <td class="exp-alignRight">
            &#8377; ${Math.abs(Amount)}
        </td>
        <td>
            <a class="exp-deleteIcon" href="javascript:void(0);">
                <img src="/styles/images/delete.png" alt="Delete"/>
            </a>
        </td>
    </tr>
</script>