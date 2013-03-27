(function() {
    'use strict';
    var loginButton = $('#btnLogin')
        .button()
        .unbind()
        .on('click', validateUser)
        .button('enable');

    function validateUser() {
        loginButton.button('option', 'label', 'Signing In...').button('disable');
        var rsa = new RSAKey();
        rsa.setPublic(param.Modulus, param.Exponent);
        var username = rsa.encrypt(param.Nounce + $('#txtUsername').val());
        var pass = rsa.encrypt(param.Nounce + $('#txtPassword').val());
        $('#hfUserName').val(username);
        $('#hfPassword').val(pass);
        $('#btnPostback').trigger('click');
        return false;
    }
})();