var $login = $('#btnLogin');
var $userName = $('#txtUsername');
var $password = $('#txtPassword');
var pkey = $('#hfKey').val().split(',');

$login.button()
    .unbind('click')
    .on('click', validateUser);

function validateUser() {
    $login.button('option', 'label', 'Signing In...').button('disable');
    var rsa = new RSAKey();
    rsa.setPublic(pkey[1], pkey[0]);
    var username = rsa.encrypt($userName.val());
    var pass = rsa.encrypt($password.val());
    $.ajax({
        url: 'Default.aspx/ValidateUser',
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            username: username,
            password: pass
        }),
        success: function(result) {
            if (result.d) {
                window.location.href = window.location.href.replace(/default\.aspx$/i, 'Dashboard.aspx');
            }
        }
    });
    return false;
}