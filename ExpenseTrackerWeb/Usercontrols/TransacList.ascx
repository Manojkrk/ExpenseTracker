﻿<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="TransacList.ascx.cs" Inherits="Manoj.ExpenseTracker.Web.Usercontrols.TransacList" %>
<table id="tableTransac" class="table table-bordered table-striped table-hover hidden" data-bind="css: { hidden: hideTransacs }">
    <thead>
        <tr>
            <th class="ui-tabs-active ui-state-active clickable" data-bind="sort: { list: transacs, property: 'Date', descendingFirst: true }">
                <a href="javascript:void(0)">Date<div class="sortIcon ui-icon"></div></a>
            </th>
            <th class="ui-tabs-active ui-state-active clickable" data-bind="sort: { list: transacs, property: 'Type' }">
                <a href="javascript:void(0)">Type<div class="sortIcon ui-icon"></div></a>
            </th>
            <th class="ui-tabs-active ui-state-active clickable" data-bind="sort: { list: transacs, property: 'Description' }">
                <a href="javascript:void(0)">Description<div class="sortIcon ui-icon"></div></a>
            </th>
            <th class="ui-tabs-active ui-state-active clickable" data-bind="sort: { list: transacs, property: 'Persons' }">
                <a href="javascript:void(0)">Persons<div class="sortIcon ui-icon"></div></a>
            </th>
            <th class="ui-tabs-active ui-state-active clickable" data-bind="sort: { list: transacs, property: 'Amount' }">
                <a href="javascript:void(0)">Amount<div class="sortIcon ui-icon"></div></a>
            </th>
            <th></th>
        </tr>
    </thead>
    <tbody id="tbodyTransac" data-bind="foreach: transacs">
        <tr class="editable" data-bind="click: $root.openEditTransac">
            <td data-bind="text: $.datepicker.formatDate('dd/mm/yy', Date)"></td>
            <td data-bind="text: Type"></td>
            <td data-bind="text: Description"></td>
            <td data-bind="text: names()"></td>
            <td class="exp-alignRight">
                &#8377;
                <!-- ko text: Amount --><!-- /ko -->
            </td>
            <td>
                <a class="exp-deleteIcon" href="javascript:void(0);" data-bind="click: $root.deleteTransac">
                    <img src="/styles/images/delete.png" alt="Delete"/>
                </a>
            </td>
        </tr>
    </tbody>
</table>