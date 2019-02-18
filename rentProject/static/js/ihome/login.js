function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function() {
    $("#mobile").focus(function(){
        $("#mobile-err").hide();
    });
    $("#password").focus(function(){
        $("#password-err").hide();
    });
    $(".form-login").submit(function(e){
        e.preventDefault();
        mobile = $("#mobile").val();
        passwd = $("#password").val();

//        ajax异步提交登录请求
        $.ajax({
            url: '/user/login/',
            type: 'POST',
            dataType: 'json',
            data: {'mobile': mobile, 'passwd': passwd},
            success: function(data){
                if(data.code == '2001'){
                    $('#mobile-err span').html(data.msg)
                    $('#mobile-err').show()
                }
                if(data.code == '2002'){
                    $('#mobile-err span').html(data.msg)
                    $('#mobile-err').show()
                }
                if(data.code == '2003'){
                    $('#mobile-err span').html(data.msg)
                    $('#mobile-err').show()
                }
                if(data.code == '2004'){
                    $('#password-err span').html(data.msg)
                    $('#password-err').show()
                }
                if(data.code == '200'){
//                  location.href = '/user/mine/'
                    $(location).attr('href', '/user/mine/')
                }
            },
            error: function(data){
                alert('error')
            }
        })
    });
})