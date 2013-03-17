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
    this.selectedTransac = ko.observable();
}

ViewModel.prototype.openNewTransacDialog = function() {
    currentRow = null;
    m.editTransac.dialog
        .find('input')
        .filter('[type=text],[type=date]')
        .val('')
        .end()
        .filter('[type=checkbox],[type=radio]')
        .prop('checked', false);
    m.editTransac.typeButtonset.buttonset('refresh');

    editTransacChanged = false;
    m.editTransac.dialog
        .dialog('option', 'title', 'New Transaction')
        .dialog('open');
};
ViewModel.prototype.refreshPersons = function() {
    var self = this;
    $.ajax({
        url: 'ExpenseTrackerService.svc/GetPersons',
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ profileId: self.currentProfileId() }),
        success: function(result) {
            persons = result;
            self.persons(result);
            $('#etrPersons').empty().append($('#tmplEditTransacPerson').tmpl(result));
        }
    });
};
ViewModel.prototype.refreshTransacs = function() {
    var self = this;
    $.ajax({
        url: 'ExpenseTrackerService.svc/GetTransacs',
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
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
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ profileId: self.currentProfileId() }),
        success: function(result) {
            self.balances(result);
        }
    });
};


ViewModel.prototype.openEditTransac = function(transacRow) {
    currentRow = transacRow;
    var data = transacRow.tmplItem().data;
    m.editTransac.datepicker.datepicker('setDate', (data.Date));
    if (data.Amount > 0) {
        $('#etrTypeInput').prop('checked', true);
    } else {
        $('#etrTypeExpense').prop('checked', true);
    }
    m.editTransac.typeButtonset.buttonset('refresh');
    $('#txtTransacDescription').val(data.Description);
    $('#txtTransacAmount').val(Math.abs(data.Amount));
    m.editTransac.dialog.find('input').filter('[type=checkbox]').each(function() {
        this.checked = (data.PersonIds.indexOf(parseInt(this.value)) !== -1);
    });

    editTransacChanged = false;
    m.editTransac.dialog.dialog('option', 'title', 'Edit Transaction')
        .dialog('open');
};

ViewModel.prototype.insertTransac = function(transac) {
    var self = this;
    var msTransac = $.extend({}, transac);
    msTransac.Date = transac.Date.toMsJson();
    $.ajax({
        url: 'ExpenseTrackerService.svc/InsertTransac',
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
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

ko.bindingHandlers.jqueryButtonRefresh

// extending dialog to have default button

//$.ui.dialog.fn._create


$(document).ready(startup);

function startup() {
    initEditTransac();
    init();
    vm = new ViewModel();
    ko.applyBindings(vm);
    vm.refreshPersons();
    vm.refreshTransacs();
    vm.refreshBalances();
}

function init() {
    $('#btnNewTransac').button();

    $('#btnManageProfile').button({
        icons: {
            primary: 'ui-icon-gear'
        },
        text: false
    });

    $('#tbodyTransac').on('click', '.exp-deleteIcon', function() {
        var transacRow = $(this);
        if (confirm("Do you want to delete the transaction '" + transacRow.tmplItem().data.Description + "'?")) {
            deleteTransac(transacRow);
        }
        return false;
    }).on('click', '.editable', function() {
        openEditTransac($(this));
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

function deleteTransac(transacRow) {
    $.ajax({
        url: 'ExpenseTrackerService.svc/DeleteTransac',
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ transacId: transacRow.tmplItem().data.Id }),
        success: function(result) {
            if (result !== true) {
                alert('error occured on save. Please try again');
            }
            transacRow.closest('tr').remove();
            vm.refreshBalances();
        }
    });
}

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