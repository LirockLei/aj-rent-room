function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}
$(document).ready(function(){
    $('#form-auth').submit(function(e){
        e.preventDefault();
        $(this).ajaxSubmit({
            url: '/user/auth/',
            type: 'POST',
            dataType: 'json',
            success: function(data){
                console.log(data)
                if(data.code == '5001'){
                    $('#error-msg span').html(data.msg)
                    $('#error-msg').show()
                }
                if(data.code == '5002'){
                    $('#error-msg span').html(data.msg)
                    $('#error-msg').show()
                }
                if(data.code == '5003'){
                    $('#error-msg span').html(data.msg)
                    $('#error-msg').show()
                }
                if(data.code == '200'){
                    location.href = '/user/mine/'
                }
            },
            error: function(data){
                alert('error')
            }
        })
    })
    $.ajax({
        url: '/user/auth_info/',
        type: 'GET',
        dataType: 'json',
        success: function(data){
                console.log(data)
                if(data.code == '200'){
                    $('#real-name').attr('value', data.data.id_name)
                    $('#real-name').attr('disabled', 'disabled')
                    $('#id-card').attr('value', data.data.id_card)
                    $('#id-card').attr('disabled', 'disabled')
                    $('.btn-success').hide()
                }
        },
        error: function(data){
            alert('error')
        }
    })
})

