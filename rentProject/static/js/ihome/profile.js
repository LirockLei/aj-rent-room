function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    $('#form-avatar').submit(function(e){
        e.preventDefault();
        $(this).ajaxSubmit({
            url: '/user/profile/',
            dataType: 'json',
            type: 'POST',
            success: function(data){
                console.log(data)
                if(data.code == '200'){
                    location.href = '/user/mine/'
                }
            },
            error: function(data){
                alert('error')
            }
        })
    })
    $('#form-name').submit(function(e){
        e.preventDefault();
        $(this).ajaxSubmit({
            url: '/user/profile/',
            dataType: 'json',
            type: 'POST',
            success: function(data){
                console.log(data)
                if(data.code == '200'){
                    location.href = '/user/mine/'
                }
                if(data.code == '3001'){
                    $('.error-msg').html(data.msg)
                    $('.error-msg').show()
                }
            },
            error: function(data){
                alert('error')
            }
        })
    })
})
