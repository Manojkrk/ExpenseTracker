
$('#btnLogin')
    .button()
    .unbind()
    .on('click', validateUser)
    .button('enable');

function validateUser() {
    $('#btnLogin').button('option', 'label', 'Signing In...').button('disable');
    var rsa = new RSAKey();
    rsa.setPublic(param.Modulus, param.Exponent);
    var username = rsa.encrypt(param.Nounce + $('#txtUsername').val());
    var pass = rsa.encrypt(param.Nounce + $('#txtPassword').val());
    $('#hfUserName').val(username);
    $('#hfPassword').val(pass);
    $('#btnPostback').trigger('click');
    return false;
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