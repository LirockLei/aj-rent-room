$(document).ready(function(){
//    $(".auth-warn").show();
    $.ajax({
        url: '/home/house_info/',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            console.log(data)
            if(data.code == '200'){
                $('#without-id-card').hide()
                $('#houses-list').show()
            }else{
                $('#without-id-card').show()
                $('#houses-list').hide()
            }
        }
    })
    $.ajax({
        url: '/home/show_house/',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            if(data.code == '200'){
                console.log(data)
                for(index in data.data){
                    house = data.data[index]
                    var liNode = $('<li></li>')
                    var detail_path = '/home/detail/?house=' + house.id
                    var aNode = $('<a></a>').attr('href', detail_path)
                    var div1Node = $('<div class="house-title"></div>')
                    var h3Node = $('<h3>'+'房屋ID：'+ house.id + '——' + house.title +'</h3>')
                    var div2Node = $('<div class="house-content"></div>')
                    var imgNode = $('<img/>').attr('src', house.image)
                    var div3Node = $('<div class="house-text"></div>')
                    var ulNode = $('<ul></ul>')
                    var li1Node = $('<li>'+ '位于：' + house.area + '</li>')
                    var li2Node = $('<li>'+ '价格：￥' + house.price + '/晚' + '</li>')
                    var li3Node = $('<li>'+ '发布时间：' + house.create_time + '</li>')
                    $('#houses-list').append(liNode)
                    $(liNode).append(aNode)
                    $(aNode).append(div1Node)
                    $(aNode).append(div2Node)
                    $(div1Node).append(h3Node)
                    $(div2Node).append(imgNode)
                    $(div2Node).append(div3Node)
                    $(div3Node).append(ulNode)
                    $(ulNode).append(li1Node)
                    $(ulNode).append(li2Node)
                    $(ulNode).append(li3Node)
                }
            }else{
                console.log('wrong')
            }
        },
        error: function(data){
            alert('error')
        }
    })
})
