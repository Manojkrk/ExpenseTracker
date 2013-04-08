'use strict';
var editTransacChanged = false;
var m = {
    editTransac: {
        dialog: $('#editTransacDialog'),
        typeButtonset: $('#etrTransacTypeButtonset'),
        datepicker: $('#transacDatepicker')
    }
};

// Poly fill
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fn, scope) {
        for (var i = 0, len = this.length; i < len; ++i) {
            fn.call(scope, this[i], i, this);
        }
    };
}

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
    this.selectedTransac = ko.observable(new Transac());

    this.enableNewTransac = ko.computed(function() {
        return this.persons() !== null;
    }, this);
    this.hideTransacs = ko.computed(function() {
        return this.transacs() === null;
    }, this);
    this.hideBalances = ko.computed(function() {
        return this.balances().TotalBalance === undefined;
    }, this);

    // Subscriptions

    this.currentProfile.subscribe(function() {
        vm.refreshPersons();
        vm.refreshTransacs();
        vm.refreshBalances();
    });
}

ViewModel.prototype.openNewTransacDialog = function() {
    vm.selectedTransac(new Transac());
    editTransacChanged = false;
    m.editTransac.dialog
        .dialog('option', 'title', 'New Transaction')
        .dialog('open');
};

ViewModel.prototype.selectProfile = function(profile) {
    vm.currentProfile(profile);
};

ViewModel.prototype.openNewProfileDialog = function () {
    document.getElementById('inputDialogLabel').innerText = "Enter Profile Name";
    $('#inputDialogSave').button('option', 'label', 'Create');
    $('#inputDialog').dialog('option', 'title', 'Create Profile').dialog('open');
};

ViewModel.prototype.createProfile = function (profileName) {
    var self = this;
    if (typeof profileName === "string" && profileName.trim()) {
        $.ajax({
            url: 'ExpenseTrackerService.svc/CreateProfile',
            data: JSON.stringify({ profileName: profileName }),
            success: function(profileId) {
                if (profileId) {
                    var newProfile = {
                        Id: profileId,
                        Name: profileName
                    };
                    self.profiles.push(newProfile);
                    self.currentProfile(newProfile);
                }
            }
        });
    }
    else {
        alert('Enter a valid name for the Profile');
    }
};

ViewModel.prototype.refreshPersons = function() {
    var self = this;
    this.persons([]);
    $.ajax({
        url: 'ExpenseTrackerService.svc/GetPersons',
        data: JSON.stringify({ profileId: self.currentProfile().Id }),
        success: function(result) {
            self.persons(result);
        }
    });
};
ViewModel.prototype.refreshTransacs = function() {
    var self = this;
    this.transacs(null);
    $.ajax({
        url: 'ExpenseTrackerService.svc/GetTransacs',
        data: JSON.stringify({ profileId: self.currentProfile().Id }),
        success: function(result) {
            var transacs = [];
            result.forEach(function(transac) {
                transacs.push(ko.observable(new Transac(transac)));
            });
            self.transacs(transacs);
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
    if ($(e.target).is('.exp-deleteIcon') || $(e.target).closest('.exp-deleteIcon').length) {
        return;
    }
    vm.selectedTransac(new Transac(transac));

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
    transac.state = rowStatus.creating;
    var currentTransac = ko.observable(transac);
    self.transacs.unshift(currentTransac);
    var msTransac = getMsTransac(transac);
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
            self.refreshBalances();
        }
    });
};

ViewModel.prototype.updateTransac = function(transac) {
    var self = this;
    var currentTransac;
    var transacs = this.transacs();
    for (var index = 0, len = transacs.length; index < len; index++) {
        currentTransac = transacs[index];
        if (currentTransac.peek().Id === transac.Id) {
            break;
        }
    }
    if (currentTransac) {
        transac.state = rowStatus.updating;
        currentTransac(transac);
        var msTransac = getMsTransac(transac);
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
                self.refreshBalances();
            }
        });
    }
};

function Transac(data) {
    var self = this;
    this.PersonIds = [];
    if (data && typeof data === "object") {
        if (data instanceof Transac) {
            $.extend(this, data);
            this.PersonIds = data.PersonIds.slice(0);
        }
        else {
            for (var property in data) {
                switch (property) {
                case "Date":
                    this.Date = convertJsonDate(data.Date);
                    break;
                case "PersonIds":
                    if ($.isArray(data.PersonIds)) {
                        this.PersonIds = [];
                        data.PersonIds.forEach(function(personId) {
                            self.PersonIds.push(personId.toString());
                        });
                    }
                    else {
                        this.PersonIds = data.PersonIds;
                    }
                    break;
                case "Amount":
                    if (data.Amount > 0) {
                        this.Type = 'Input';
                    }
                    else if (data.Amount < 0) {
                        this.Type = 'Expense';
                    }
                    else {
                        this.Type = '';
                    }

                    this.Amount = isNaN(data.Amount) ? '' : Math.abs(data.Amount);
                    break;
                default:
                    this[property] = data[property];
                }
            }
        }
    }
    else {
        this.state = rowStatus.creating;
    }
    if (!this.state) {
        this.state = rowStatus.ready;
    }
}

$.extend(Transac.prototype, {
    Id: 0,
    Type: '',
    Amount: '',
    Description: ''
});

Transac.prototype.names = function() {
    var personNames = '';
    var persons = vm.persons();
    for (var i = 0; i < persons.length; i++) {
        for (var j = 0; j < this.PersonIds.length; j++) {
            if (persons[i].Id == this.PersonIds[j]) {
                personNames += ', ' + persons[i].Name;
                break;
            }
        }
    }
    return personNames.substring(2);
};

Transac.prototype.isValid = function() {
    return (this.Id >= 0 &&
        (this.Type === 'Input' || this.Type === 'Expense') &&
        this.Amount > 0 &&
        this.Description &&
        this.PersonIds && this.PersonIds.length &&
        this.Date && this.Date < new Date());
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

// Knockout custom bindings

ko.bindingHandlers.jqchecked = {
    'init': function(element, valueAccessor, allBindingsAccessor) {
        var updateHandler = function() {
            var valueToWrite;
            if ((element.type === "radio") && (element.checked)) {
                valueToWrite = element.value;
            }
            else {
                return; // "checked" binding only responds to selected radio buttons
            }

            var modelValue = valueAccessor();
            if (ko.isObservable(modelValue)) {
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
        if (element.type === "radio") {
            element.checked = (element.value === value);
            /////////////// added code to ko checked binding /////////////////
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
                        return a.names();
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

function getMsTransac(transac) {
    if (transac.isValid()) {
        var msTransac = $.extend({}, transac);
        msTransac.Date = transac.Date.toMsJson();
        if (transac.Type === 'Expense') {
            msTransac.Amount = -Math.abs(transac.Amount);
        }
        return msTransac;
    }
    throw 'Invalid Data';
}

function convertJsonDate(str) {
    if (typeof str === 'string' && /\/Date\(\d+[+-]\d+\)\//i.test(str)) {
        return new Date(parseInt(str.substring(6), 10));
    }
    else {
        return null;
    }
}

function initInputDialog() {
    $('#inputDialog').dialog({
        autoOpen: false,
        modal: true,
        buttons: [
            {
                text: "Save",
                id: 'inputDialogSave',
                click: function() {
                    var profileName = document.getElementById('inputDialogText').value;
                    vm.createProfile(profileName);
                    $('#inputDialog').dialog('close');
                }
            },
            {
                text: 'Cancel',
                click: function() {
                    $('#inputDialog').dialog('close');
                }
            }]
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
                        var editedTransac = vm.selectedTransac();
                        if (editedTransac.isValid()) {
                            if (!editedTransac.Id) {
                                editedTransac.state = rowStatus.creating;
                                vm.insertTransac(editedTransac);
                            }
                            else {
                                vm.updateTransac(editedTransac);
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
        .find('Input')
        .on('change, keypress', function() {
            editTransacChanged = true;
        });
}

function startup() {
    $.ajaxSetup({
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8"
    });
    initInputDialog();
    initEditTransac();
    vm = new ViewModel();
    vm.profiles(profiles);
    vm.currentProfile(vm.profiles()[0]);
    ko.applyBindings(vm);
}

$(document).ready(startup);