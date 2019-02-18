//模态框居中的控制
function centerModals(){
    $('.modal').each(function(i){   //遍历每一个模态框
        var $clone = $(this).clone().css('display', 'block').appendTo('body');    
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top-30);  //修正原先已经有的30个像素
    });
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);
    $.ajax({
        url: '/order/my_order/',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            console.log(data)
            for(index in data.orders_list){
                var order = data.orders_list[index]
//                组装订单参数
                var li_info = '<li>创建时间：' + order.create_date + '</li>'
                li_info += '<li>入住日期：' + order.begin_date + '</li>'
                li_info += '<li>离开日期：' + order.end_date + '</li>'
                li_info += '<li>合计金额：' + order.amount + '元(共' + order.days + '晚)</li>'
                status = order.status
                if(status == 'WAIT_ACCEPT'){
                    var sta = '待接单'
                };
                if(status == 'WAIT_PAYMENT'){
                    var sta = '待支付'
                };
                if(status == 'PAID'){
                    var sta = '已支付'
                };
                if(status == 'WAIT_ACCEPT'){
                    var sta = '待接单'
                };
                if(status == 'WAIT_COMMENT'){
                    var sta = '待评价'
                };
                if(status == 'COMPLETE'){
                    var sta = '已完成'
                };
                if(status == 'CANCELED'){
                    var sta = '已取消'
                };
                if(status == 'REJECTED'){
                    var sta = '已拒单'
                };
                if(order.comment == null){
                    order.comment = '暂无评价'
                };
                li_info += '<li>订单状态：<span>' + sta + '</span></li>'
                li_info += '<li>我的评价：<span>'+ order.comment + '</span></li>'
                li_info += '<li>拒单原因：</li>'
//                组装评价
                var comment_info = '<button id="' + order.order_id + '" type="button" class="btn btn-success order-comment" data-toggle="modal" data-target="#comment-modal">发表评价</button>'
//                创建order-content div1标签
                var div1Node = $('<div></div>').attr('class', 'order-content')
                var img1Node = $('<img>').attr('src', order.image)
                var div11Node = $('<div></div>').attr('class', 'order-text')
                var ulNode = $('<ul></ul>')
                ulNode.html(li_info)
                div11Node.append($('<h3>订单</h3>'))
                div11Node.append(ulNode)
                div1Node.append(img1Node)
                div1Node.append(div11Node)
//                创建order-title div2标签
                var div2Node = $('<div></div>').attr('class', 'order-title')
                var div21Node = $('<div></div>').attr('class', 'fr order-operate')
                var h3Node = $('<h3></h3>').html('订单编号：' + order.order_id)
                div21Node.html(comment_info)
                div2Node.append(h3Node)
                div2Node.append(div21Node)
//                创建li标签
                var liNode = $('<li></li>').attr('order-id', order.order_id)
                liNode.append(div2Node)
                liNode.append(div1Node)
                $('.orders-list').append(liNode)
                $('.order-comment').hide()
                if(status == 'WAIT_COMMENT'){
                    $('#'+order.order_id).show()
                }
            }
            $('.order-comment').on('click', function(){
                var orderId = $(this).attr('id');
                $('#1111').attr('order-id', orderId);
            });
        }
    })
    $('.modal-comment').click(function(){
    //    获取订单id
        orderId = $('#1111').attr('order-id')
    //    组装返回的data数据
        comment = $('#comment').val()
        data = {'comment': comment, 'orderId': orderId}
            $.ajax({
            url: '/order/comment/',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function(data){
                console.log(data)
                location.herf = '/order/orders/'
            }
        })
    })
});


