<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="EditTransac.ascx.cs" Inherits="Manoj.ExpenseTracker.Web.Usercontrols.EditTransac" %>
<div id="editTransacDialog" class="dialog">
    <div class="exp-editTransacColumn1 exp-padding10 exp-inlineBlock exp-floatLeft">
        <div class="exp-fullWidth">
            <div class="exp-dialogLabel exp-inlineBlock">
                <label for="etrTransacTypeButtonset">Type</label>
            </div>
            <div id="etrTransacTypeButtonset" class="exp-inlineBlock">
                <input id="etrTypeInput" type="radio" name="transacType" value="input"><label for="etrTypeInput">Input</label>
                <input id="etrTypeExpense" type="radio" name="transacType" value="expense"><label for="etrTypeExpense">Expense</label>
            </div>
        </div>
        <div class="exp-fullWidth">
            <div class="exp-dialogLabel exp-inlineBlock">
                <label for="transacDatepicker">Date</label>
            </div>
            <div class="exp-inlineBlock">
                <input id="transacDatepicker" type="date" class="exp-marginBottom5"/>
            </div>
        </div>
        <div class="exp-fullWidth">
            <div class="exp-dialogLabel exp-inlineBlock">
                <label for="txtTransacDescription">Description</label>
            </div>
            <div class="exp-inlineBlock">
                <input id="txtTransacDescription" type="text"/>
            </div>
        </div>
        <div class="exp-fullWidth">
            <div class="exp-dialogLabel exp-inlineBlock">
                <label for="txtTransacAmount">Amount (&#8377;)</label>
            </div>
            <div class="exp-inlineBlock">
                <input id="txtTransacAmount" type="text"/>
            </div>
        </div>
    </div>
    <div class="exp-editTransacColumn2 exp-padding10 exp-inlineBlock exp-floatLeft">
        <div class="exp-fullWidth">
            <div id="etrPersons" class="exp-inlineBlock"></div>
        </div>
    </div>
    <script id="tmplEditTransacPerson" type="text/x-jquery-tmpl">
        <div class="exp-fullWidth">
            <input id="editTransacPerson_${Id}" type="checkbox" value="${Id}" />
            <label for="editTransacPerson_${Id}">${Name}</label>
        </div>
    </script>
</div>