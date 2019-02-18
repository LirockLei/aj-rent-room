function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    // $('.popup_con').fadeIn('fast');
    // $('.popup_con').fadeOut('fast');
    $.ajax({
        url: '/home/area_info/',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            if(data.code == '200'){
                for(index in data.data){
                    var area = data.data[index]
                    var optionNode = $('<option>'+area.area_name+'</option>').attr('value', area.area_id)
                    $('#area-id').append(optionNode)
                }
            }
        },
        error: function(data){
            alert('error')
        }
    })
    $.ajax({
        url: '/home/facility_info/',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            if(data.code == '200'){
                for(index in data.data){
                    var facility = data.data[index]
                    var inputNode = $('<input type="checkbox" name="facility">').attr('value', facility.id)
                    var labelNode = $('<label></label>')
                    var spanNode = $('<span>'+facility.name+'</span>')
                    var divNode = $('<div></div>').attr('class', 'checkbox')
                    var liNode = $('<li></li>')
                    $('#facility-all').append(liNode)
                    liNode.append(divNode)
                    divNode.append(labelNode)
                    labelNode.append(inputNode)
                    labelNode.append(spanNode)
                }
            }
        },
        error: function(data){
            alert('error')
        }
    })
    $('#form-house-info').submit(function(e){
        e.preventDefault();
        $(this).ajaxSubmit({
            url: '/home/newHouse/',
            type: 'POST',
            dataType: 'json',
            success: function(data){
                if(data.code == '200'){
                    $('#house-id').attr('value', data.house_id)
                    $('#form-house-image').show()
                    $('#form-house-info').hide()
                }
            },
            error: function(data){
                alert('error')
            }
        })
    })
    $('#form-house-image').submit(function(e){
        e.preventDefault();
        $(this).ajaxSubmit({
            url: '/home/house_image/',
            type: 'POST',
            dataType: 'json',
            success: function(data){
                console.log(data)
                if(data.code == '200'){
                    var imgNode = $('<img/>').attr('src', data.image_url)
                    $('#form-house-image').prepend(imgNode)
                }
            },
        })
    })
})