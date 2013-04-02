'use strict';
var persons = null;
var currentRow = null;
var editTransacChanged = false;
var m = {
    editTransac: {
        dialog: $('#editTransacDialog'),
        typeButtonset: $('#etrTransacTypeButtonset'),
        datepicker: $('#transacDatepicker')
    }
};

Array.prototype.lenientIndexOf = function(item) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == item) {
            return i;
        }
    }
    return -1;
};

var rowStatus = {
    ready: 'ready',
    creating: 'creating',
    updating: 'updating',
    deleting: 'deleting'
};

var vm = null;

function ViewModel() {
    this.vm = this;
    this.profiles = ko.observableArray([]);
    this.currentProfile = ko.observable();
    this.persons = ko.observableArray([]);
    this.transacs = ko.observableArray(null);
    this.balances = ko.observable({});
    this.enableNewTransac = ko.computed(function() {
        return this.persons() !== null;
    }, this);
    this.hideTransacs = ko.computed(function() {
        return this.transacs() === null;
    }, this);
    this.hideBalances = ko.computed(function() {
        return this.balances().TotalBalance === undefined;
    }, this);
    this.selectedTransac = {
        transac: ko.observable({}),
        // Amount: ko.observable(),
        type: ko.observable()
    };
    this.selectedTransac.Amount = ko.computed({
        read: function() {
            return isNaN(this.transac().Amount) ? '' : Math.abs(this.transac().Amount);
        },
        write: function(value) {
            var transac = this.transac.peek();
            if (isNaN(value)) {
                transac.Amount = 0;
            }
            else if (this.type() === 'expense') {
                transac.Amount = -Math.abs(value);
            }
            else {
                transac.Amount = Math.abs(value);
            }
        },
        owner: this.selectedTransac
    });

    // Subscriptions

    this.currentProfile.subscribe(function() {
        vm.refreshPersons();
        vm.refreshTransacs();
        vm.refreshBalances();
    });

    this.selectedTransac.transac.subscribe(function(newValue) {
        var newType = '';
        if (newValue.Amount > 0) {
            newType = 'input';
        }
        else if (newValue.Amount < 0) {
            newType = 'expense';
        }
        vm.selectedTransac.type(newType);
    });
    this.selectedTransac.type.subscribe(function(newValue) {
        var transac = vm.selectedTransac.transac();
        if (newValue === 'expense') {
            transac.Amount = -Math.abs(transac.Amount);
        }
        else {
            transac.Amount = Math.abs(transac.Amount);
        }
    });
    //this.selectedTransac.type = ko.computed({
    //    read: function() {
    //        if (this.transac().Amount > 0) {
    //            return 'input';
    //        }
    //        else if (this.transac().Amount < 0) {
    //            return 'expense';
    //        }
    //        else {
    //            return '';
    //        }
    //    },
    //    write: function(value) {
    //        var transac = this.transac();
    //        if (value === 'expense') {
    //            transac.Amount = -Math.abs(transac.Amount);
    //        }
    //        else {
    //            transac.Amount = Math.abs(transac.Amount);
    //        }
    //        this.newType = value;
    //    },
    //    owner: this.selectedTransac
    //});
}

ViewModel.prototype.openNewTransacDialog = function() {
    vm.selectedTransac.transac({});
    editTransacChanged = false;
    m.editTransac.dialog
        .dialog('option', 'title', 'New Transaction')
        .dialog('open');
};

ViewModel.prototype.selectProfile = function(profile) {
    vm.currentProfile(profile);
};

ViewModel.prototype.refreshPersons = function() {
    var self = this;
    this.persons([]);
    $.ajax({
        url: 'ExpenseTrackerService.svc/GetPersons',
        data: JSON.stringify({ profileId: self.currentProfile().Id }),
        success: function(result) {
            persons = result;
            self.persons(result);
        }
    });
};
ViewModel.prototype.refreshTransacs = function() {
    var self = this;
    this.transacs();
    $.ajax({
        url: 'ExpenseTrackerService.svc/GetTransacs',
        data: JSON.stringify({ profileId: self.currentProfile().Id }),
        success: function(result) {
            result.forEach(function(transac) {
                transac.Date = $.convertJsonDate(transac.Date);
                transac.state = rowStatus.ready;
            });
            self.transacs(result);
        }
    });
};

ViewModel.prototype.refreshBalances = function() {
    var self = this;
    this.balances({});
    $.ajax({
        url: 'ExpenseTrackerService.svc/GetBalances',
        data: JSON.stringify({ profileId: self.currentProfile().Id }),
        success: function(result) {
            self.balances(result);
        }
    });
};

ViewModel.prototype.openEditTransac = function(transac, e) {
    if ($(e.target).is('exp-deleteIcon') || $(e.target).closest('.exp-deleteIcon').is('*')) {
        return;
    }
    vm.selectedTransac.transac($.extend(true, {}, transac));

    editTransacChanged = false;
    m.editTransac.dialog.dialog('option', 'title', 'Edit Transaction')
        .dialog('open');
};

ViewModel.prototype.deleteTransac = function(transac) {
    if (confirm("Do you want to delete the transaction '" + transac.Description + "'?")) {
        $.ajax({
            url: 'ExpenseTrackerService.svc/DeleteTransac',
            data: JSON.stringify({ transacId: transac.Id }),
            success: function(result) {
                if (result !== true) {
                    alert('error occured on save. Please try again');
                }
                vm.transacs.remove(transac);
                vm.refreshBalances();
            }
        });
    }
};

ViewModel.prototype.insertTransac = function(transac) {
    var self = this;
    var msTransac = $.extend({}, transac);
    msTransac.Date = transac.Date.toMsJson();
    $.ajax({
        url: 'ExpenseTrackerService.svc/InsertTransac',
        data: JSON.stringify({
            profileId: self.currentProfile().Id,
            transac: msTransac
        }),
        success: function(result) {
            if (result === 0) {
                alert('error occured on save. Please try again');
            }
            else {
                $('#tmplTransac').tmpl(transac).prependTo('#tbodyTransac');
            }
            vm.refreshBalances();
        }
    });
};

// Date date converters for json

Date.prototype.toMsJson = function() {
    var date = '\/Date(' + this.getTime() + ')\/';
    return date;
};
JSON.toMsFormat = function(obj) {
    if (obj instanceof Object) {
        for (var propName in obj) {
            var propVal = obj[propName];
            if (propVal instanceof Date) {
                obj[propName] = propVal.toMsJson();
            }
            else if (propVal instanceof Object) {
                json.toMsFormat(propVal);
            }
        }
    }
};

$.convertJsonDate = function(str) {
    if ($.type(str) === 'string' && /\/Date\(\d+[+-]\d+\)\//i.test(str)) {
        return new Date(parseInt(str.substring(6), 10));
    }
    else {
        return null;
    }
};

$.formatJsonDate = function(str) {
    return $.datepicker.formatDate('dd/mm/yy', $.convertJsonDate(str));
};

// Knockout custom bindings

ko.bindingHandlers.jqchecked = {
    'init': function(element, valueAccessor, allBindingsAccessor) {
        var updateHandler = function() {
            var valueToWrite;
            if (element.type === "checkbox") {
                valueToWrite = element.checked;
            }
            else if ((element.type === "radio") && (element.checked)) {
                valueToWrite = element.value;
            }
            else {
                return; // "checked" binding only responds to checkboxes and selected radio buttons
            }

            var modelValue = valueAccessor();
            var modelValueUnwrapped = ko.utils.unwrapObservable(modelValue);
            if ((element.type === "checkbox") && (modelValueUnwrapped instanceof Array)) {
                // For checkboxes bound to an array, we add/remove the checkbox value to that array
                // This works for both observable and non-observable arrays
                var existingEntryIndex = modelValueUnwrapped.lenientIndexOf(element.value);
                if (element.checked && (existingEntryIndex < 0)) {
                    modelValue.push(parseInt(element.value, 10));
                }
                else if ((!element.checked) && (existingEntryIndex >= 0)) {
                    modelValue.splice(existingEntryIndex, 1);
                }
            }
            else if (ko.isObservable(modelValue)) {
                if (ko.isWriteableObservable(modelValue) && modelValue.peek() !== valueToWrite) { // Suppress repeated events when there's nothing new to notify (some browsers raise them)
                    modelValue(valueToWrite);
                }
            }
            else {
                var allBindings = allBindingsAccessor();
                if (allBindings._ko_property_writers && allBindings._ko_property_writers.jqchecked) {
                    allBindings._ko_property_writers.jqchecked(valueToWrite);
                }
            }
        };
        ko.utils.registerEventHandler(element, "click", updateHandler);

        // IE 6 won't allow radio buttons to be selected unless they have a name
        if ((element.type === "radio") && !element.name) {
            ko.bindingHandlers.uniqueName.init(element, function() {
                return true;
            });
        }
    },

    'update': function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (element.type === "checkbox") {
            if (value instanceof Array) {
                // When bound to an array, the checkbox being checked represents its value being present in that array
                $(element).prop('checked', value.lenientIndexOf(element.value) >= 0);
            }
            else {
                // When bound to anything other value (not an array), the checkbox being checked represents the value being trueish
                $(element).prop('checked', !!value);
            }

            $(element).filter('.ui-button').button('refresh');
        }
        else if (element.type === "radio") {
            element.checked = (element.value === value);
            /////////////// addded code to ko checked binding /////////////////
            $(element).button('refresh');
            /////////////// end add ///////////////////////////
            // Workaround for IE 6/7 issue - it fails to apply checked state to dynamically-created radio buttons if you merely say "element.checked = true"
            if ((element.value === value) && (ko.utils.isIe6 || ko.utils.isIe7)) {
                element.mergeAttributes(document.createElement("<input type='radio' checked='checked' />"), false);
            }
        }
    }
};
ko.bindingHandlers.datepicker = {
    init: function(element, valueAccessor, allBindingsAccessor) {
        $(element).datepicker('option', 'onSelect', function() {
            var valueToWrite = $(element).datepicker('getDate');
            var modelValue = valueAccessor();
            if (ko.isObservable(modelValue)) {
                if (ko.isWriteableObservable(modelValue) && modelValue.peek() !== valueToWrite) { // Suppress repeated events when there's nothing new to notify (some browsers raise them)
                    modelValue(valueToWrite);
                }
            }
            else { //non-observable
                allBindingsAccessor()._ko_property_writers.datepicker(valueToWrite);
            }
        });
    },
    update: function(element, valueAccessor) {
        // First get the latest data that we're bound to
        var value = valueAccessor();

        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.utils.unwrapObservable(value);
        $(element).datepicker('setDate', valueUnwrapped);
    }
};

ko.bindingHandlers.sort = {
    init: function(element, valueAccessor) {
        var modelValue = valueAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(modelValue);
        if (valueUnwrapped && valueUnwrapped.list && valueUnwrapped.property) {
            var propertyUnwrapped = ko.utils.unwrapObservable(valueUnwrapped.property);
            var isDescendingFirstUnwrapped = ko.utils.unwrapObservable(valueUnwrapped.descendingFirst);
            var modifier = isDescendingFirstUnwrapped ? -1 : 1;

            var sortFunction = (function() {

                function getPropertyValue(a) {
                    switch (propertyUnwrapped) {
                    case 'Type':
                        return (a.Amount > 0) - (a.Amount < 0);
                    case 'Amount':
                        return (Math.abs(a.Amount));
                    case 'Persons':
                        return getPersonNames(a.PersonIds);
                    case undefined:
                    case null:
                        return a;
                    default:
                        return a[propertyUnwrapped];
                    }
                }

                return function(a, b) {
                    var va = getPropertyValue(a);
                    var vb = getPropertyValue(b);
                    return va == vb ? 0 : va > vb ? -modifier : modifier;
                };
            })();


            $(element).click(function() {
                modifier = -modifier;
                if (valueUnwrapped.list()) {
                    valueUnwrapped.list.sort(sortFunction);
                }
                if (modifier > 0) {
                    $(this).removeClass('sortAsc').addClass('sortDesc');
                }
                else {
                    $(this).removeClass('sortDesc').addClass('sortAsc');
                }
            });
        }
    }
};

// extending dialog to have default button

//$.ui.dialog.fn._create


$(document).ready(startup);

function startup() {
    $.ajaxSetup({
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8"
    });
    initEditTransac();
    initDashboard();
    vm = new ViewModel();
    vm.profiles(profiles);
    vm.currentProfile(vm.profiles()[0]);
    ko.applyBindings(vm);
}

function initDashboard() {
    $('#btnNewTransac').button();

    $('#btnManageProfile').button({
        icons: {
            primary: 'ui-icon-gear'
        },
        text: false
    });
}

function initEditTransac() {
    m.editTransac.typeButtonset.buttonset();
    if (!Modernizr.inputtypes.date) {
        m.editTransac.datepicker.datepicker({
            showButtonPanel: true,
            dateFormat: 'd-M-yy'
        });
    }
    m.editTransac.dialog
        .dialog({
            autoOpen: false,
            modal: true,
            resizable: false,
            width: 640,
            beforeClose: function() {
                return !editTransacChanged || confirm('Are you sure you want to Cancel? Changes made will be discarded.');
            },
            buttons: [
                {
                    text: "Save",
                    click: function() {
                        var editedTransac = getEditedTransac();
                        if (editedTransac != null) {
                            if (currentRow === null) {
                                editedTransac.Id = 0;
                                vm.insertTransac(editedTransac);
                            }
                            else {
                                var data = currentRow.tmplItem().data;
                                $.extend(data, editedTransac);
                                updateTransac(data);
                                data.state = rowStatus.updating;
                                currentRow.tmplItem().update();
                            }
                            editTransacChanged = false;
                            m.editTransac.dialog.dialog('close');
                        }
                        else {
                            alert('incorrect data please try again');
                        }
                    }
                },
                {
                    text: "Cancel",
                    click: function() {
                        m.editTransac.dialog.dialog('close');
                    }
                }
            ]
        })
        .removeClass('hidden')
        .find('input')
        .on('change, keypress', function() {
            editTransacChanged = true;
        });
}


function getEditedTransac() {
    var transac = {
        PersonIds: []
    };
    try {
        transac.Date = $.datepicker.parseDate('d-M-yy', m.editTransac.datepicker.val());
        transac.Description = $('#txtTransacDescription').val();
        transac.Amount = parseFloat($('#txtTransacAmount').val());
        if (isNaN(transac.Amount)) {
            return null;
        }
        //if expense is selected invert the amount
        if ($('#etrTypeExpense').is(':checked')) {
            transac.Amount = -transac.Amount;
        }
        else if (!$('#etrTypeInput').is(':checked')) {
            // if both are unchecked return null
            return null;
        }
        $('#etrPersons').find('input').each(function() {
            if (this.checked) {
                transac.PersonIds.push(parseInt(this.value, 10));
            }
        });
    } catch(ex) {
        return null;
    }
    return transac;
}

function updateTransac(transac) {
    var msTransac = $.extend({}, transac);
    msTransac.Date = transac.Date.toMsJson();
    $.ajax({
        url: 'ExpenseTrackerService.svc/UpdateTransac',
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ transac: msTransac }),
        success: function(result) {
            if (result !== true) {
                alert('error occured on save. Please try again');
            }
            vm.refreshBalances();
        }
    });
}

function getPersonNames(personIds) {
    var personNames = '';
    var persons = vm.persons();
    for (var i = 0; i < persons.length; i++) {
        for (var j = 0; j < personIds.length; j++) {
            if (persons[i].Id === personIds[j]) {
                personNames += ', ' + persons[i].Name;
                break;
            }
        }
    }
    return personNames.substring(2);
}