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
    this.persons = ko.observableArray([]);
    this.transacs = ko.observableArray(null);
    this.balances = ko.observable({});
    this.currentProfileId = ko.observable();
    this.enableNewTransac = ko.computed(function() {
        return this.persons() !== null;
    }, this);
    this.hideTransacs = ko.computed(function() {
        return this.transacs() === null;
    }, this);
    this.hideBalances = ko.computed(function() {
        return typeof(this.balances().TotalBalance) === 'undefined';
    }, this);
    this.selectedTransac = ko.observable({});
    this.selectedTransacType = ko.computed(function() {
        if (this.selectedTransac().Amount > 0) {
            return 'input';
        } else if (this.selectedTransac().Amount < 0) {
            return 'expense';
        } else {
            return '';
        }
    }, this);
}

ViewModel.prototype.openNewTransacDialog = function() {
    vm.selectedTransac({});
    editTransacChanged = false;
    m.editTransac.dialog
        .dialog('option', 'title', 'New Transaction')
        .dialog('open');
};
ViewModel.prototype.refreshPersons = function() {
    var self = this;
    $.ajax({
        url: 'ExpenseTrackerService.svc/GetPersons',
        data: JSON.stringify({ profileId: self.currentProfileId() }),
        success: function(result) {
            persons = result;
            self.persons(result);
        }
    });
};
ViewModel.prototype.refreshTransacs = function() {
    var self = this;
    $.ajax({
        url: 'ExpenseTrackerService.svc/GetTransacs',
        data: JSON.stringify({ profileId: self.currentProfileId() }),
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
    $.ajax({
        url: 'ExpenseTrackerService.svc/GetBalances',
        data: JSON.stringify({ profileId: self.currentProfileId() }),
        success: function(result) {
            self.balances(result);
        }
    });
};


ViewModel.prototype.openEditTransac = function(transac, e) {
    if ($(e.target).is('exp-deleteIcon') || $(e.target).closest('.exp-deleteIcon').is('*')) {
        return;
    }
    vm.selectedTransac($.extend(true, {}, transac));

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
            profileId: self.currentProfileId(),
            transac: msTransac
        }),
        success: function(result) {
            if (result == 0) {
                alert('error occured on save. Please try again');
            } else {
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
            } else if (propVal instanceof Object) {
                json.toMsFormat(propVal);
            }
        }
    }
};

$.convertJsonDate = function(str) {
    if ($.type(str) === 'string' && /\/Date\(\d+[+-]\d+\)\//i.test(str)) {
        return new Date(parseInt(str.substring(6)));
    } else {
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
            if (element.type == "checkbox") {
                valueToWrite = element.checked;
            } else if ((element.type == "radio") && (element.checked)) {
                valueToWrite = element.value;
            } else {
                return; // "checked" binding only responds to checkboxes and selected radio buttons
            }

            var modelValue = valueAccessor();
            var modelValueUnwrapped = ko.utils.unwrapObservable(modelValue);
            if ((element.type == "checkbox") && (modelValueUnwrapped instanceof Array)) {
                // For checkboxes bound to an array, we add/remove the checkbox value to that array
                // This works for both observable and non-observable arrays
                var existingEntryIndex = modelValueUnwrapped.lenientIndexOf(element.value);
                if (element.checked && (existingEntryIndex < 0)) modelValue.push(parseInt(element.value));
                else if ((!element.checked) && (existingEntryIndex >= 0)) modelValue.splice(existingEntryIndex, 1);
            } else if (ko.isObservable(modelValue)) {
                if (ko.isWriteableObservable(modelValue) && modelValue.peek() !== valueToWrite) { // Suppress repeated events when there's nothing new to notify (some browsers raise them)
                    modelValue(valueToWrite);
                }
            } else {
                var allBindings = allBindingsAccessor();
                if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers']['checked']) {
                    allBindings['_ko_property_writers']['checked'](valueToWrite);
                }
            }
        };
        ko.utils.registerEventHandler(element, "click", updateHandler);

        // IE 6 won't allow radio buttons to be selected unless they have a name
        if ((element.type == "radio") && !element.name)
            ko.bindingHandlers['uniqueName']['init'](element, function() {
                return true;
            });
    },

    'update': function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (element.type == "checkbox") {
            if (value instanceof Array) {
                // When bound to an array, the checkbox being checked represents its value being present in that array
                $(element).prop('checked', value.lenientIndexOf(element.value) >= 0);
            } else {
                // When bound to anything other value (not an array), the checkbox being checked represents the value being trueish
                $(element).prop('checked', typeof value !== "undefined" ? value : false);
            }

            $(element).filter('.ui-button').button('refresh');
        } else if (element.type == "radio") {
            element.checked = (element.value == value);
            /////////////// addded code to ko checked binding /////////////////
            $(element).button('refresh');
            /////////////// end add ///////////////////////////
            // Workaround for IE 6/7 issue - it fails to apply checked state to dynamically-created radio buttons if you merely say "element.checked = true"
            if ((element.value == value) && (ko.utils.isIe6 || ko.utils.isIe7)) element.mergeAttributes(document.createElement("<input type='radio' checked='checked' />"), false);
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
            } else { //non-observable
                allBindingsAccessor()._ko_property_writers.datepicker(valueToWrite);
            }
        });
    },
    update: function(element, valueAccessor, allBindingsAccessor) {
        // First get the latest data that we're bound to
        var value = valueAccessor(), allBindings = allBindingsAccessor();

        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.utils.unwrapObservable(value);
        $(element).datepicker('setDate', value);
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
    ko.applyBindings(vm);
    vm.refreshPersons();
    vm.refreshTransacs();
    vm.refreshBalances();
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

function cancelEditTransac(parameters) {
    if (editTransacChanged) {
        if (!confirm('Are you sure you want to Cancel? Changes made will be discarded.')) {
            return;
        }
    }
    m.editTransac.dialog.dialog('close');
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
            buttons: [
                {
                    text: "Save",
                    click: function() {
                        var editedTransac = getEditedTransac();
                        if (editedTransac != null) {
                            if (currentRow == null) {
                                editedTransac.Id = 0;
                                insertTransac(editedTransac);
                            } else {
                                var data = currentRow.tmplItem().data;
                                $.extend(data, editedTransac);
                                updateTransac(data);
                                data.state = rowStatus.updating;
                                currentRow.tmplItem().update();
                            }
                            editTransacChanged = false;
                            m.editTransac.dialog.dialog('close');
                        } else {
                            alert('incorrect data please try again');
                        }
                    }
                },
                {
                    text: "Cancel",
                    click: cancelEditTransac
                }
            ]
        })
        .removeClass('hidden');
    m.editTransac.dialog
        .closest('.ui-dialog')
        .find('.ui-dialog-titlebar-close')
        .unbind()
        .click(cancelEditTransac);
    m.editTransac.dialog
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
        } else if (!$('#etrTypeInput').is(':checked')) {
            // if both are unchecked return null
            return null;
        }
        $('#etrPersons').find('input').each(function() {
            if (this.checked) {
                transac.PersonIds.push(parseInt(this.value));
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

// event to fire default button

function WebForm_FireDefaultButton(event, target) {
    if (event.keyCode == 13) {
        var src = event.srcElement || event.target;
        if (src &&
            ((src.tagName.toLowerCase() == "input") &&
                (src.type.toLowerCase() == "submit" || src.type.toLowerCase() == "button")) ||
            ((src.tagName.toLowerCase() == "a") &&
                (src.href != null) && (src.href != "")) ||
            (src.tagName.toLowerCase() == "textarea")) {
            return true;
        }
        $(target).trigger('click');
    }
    return true;
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