<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="EditTransac.ascx.cs" Inherits="Manoj.ExpenseTracker.Web.Usercontrols.EditTransac" %>
<div id="editTransacDialog" class="dialog" data-bind="with: selectedTransac">
    <div class="exp-editTransacColumn1 exp-padding10 exp-inlineBlock exp-floatLeft">
        <div class="exp-fullWidth">
            <div class="exp-dialogLabel exp-inlineBlock">
                <label for="etrTransacTypeButtonset">Type</label>
            </div>
            <div id="etrTransacTypeButtonset" class="exp-inlineBlock">
                <input id="etrTypeInput" type="radio" name="transacType" value="input" data-bind="jqchecked: type" />
                <label for="etrTypeInput">Input</label>
                <input id="etrTypeExpense" type="radio" name="transacType" value="expense" data-bind="jqchecked: type" />
                <label for="etrTypeExpense">Expense</label>
            </div>
        </div>
        <div class="exp-fullWidth">
            <div class="exp-dialogLabel exp-inlineBlock">
                <label for="transacDatepicker">Date</label>
            </div>
            <div class="exp-inlineBlock">
                <input id="transacDatepicker" type="date" class="exp-marginBottom5" data-bind="datepicker: transac().Date" />
            </div>
        </div>
        <div class="exp-fullWidth">
            <div class="exp-dialogLabel exp-inlineBlock">
                <label for="txtTransacDescription">Description</label>
            </div>
            <div class="exp-inlineBlock">
                <input id="txtTransacDescription" type="text" data-bind="value: transac().Description" />
            </div>
        </div>
        <div class="exp-fullWidth">
            <div class="exp-dialogLabel exp-inlineBlock">
                <label for="txtTransacAmount">Amount (&#8377;)</label>
            </div>
            <div class="exp-inlineBlock">
                <input id="txtTransacAmount" type="text" data-bind="value: Amount"/>
            </div>
        </div>
    </div>
    <div class="exp-editTransacColumn2 exp-padding10 exp-inlineBlock exp-floatLeft">
        <div class="exp-fullWidth">
            <div id="etrPersons" class="exp-inlineBlock" data-bind="foreach: $root.persons">
                <div class="exp-fullWidth">
                    <input type="checkbox" data-bind="value: Id, jqchecked: $root.selectedTransac.transac().PersonIds, attr: { id: 'editTransacPerson_' + Id }" />
                    <label data-bind="text: Name, attr: { for: 'editTransacPerson_' + Id }"></label>
                </div>
            </div>
        </div>
    </div>
</div>