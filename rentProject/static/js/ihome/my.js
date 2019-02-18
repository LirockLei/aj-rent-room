function logout() {
    $.get("/user/logout/", function(data){
        if (data.code == 200) {
            location.href = "/user/login/";
        }
    })
}

$(document).ready(function(){
    $.ajax({
        url: '/user/user_info/',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            if(data.code == '200'){
                console.log(data)
                $('#user-name').html(data.data.name)
                $('#user-mobile').html(data.data.phone)
                $('#user-avatar').attr('src', '/static/media/' + data.data.avatar)
            }
            if(data.code == '250'){
                location.href = '/user/login/'
            }
        },
        error: function(data){
            alert('error')
        }
    })
})