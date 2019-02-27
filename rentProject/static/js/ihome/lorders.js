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
    $(".order-accept").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-accept").attr("order-id", orderId);
        $(".modal-accept").on("click", function(){
            $.ajax({
                url: '/order/order_accept/',
                type: 'POST',
                dataType: 'json',
                data: {'order_id': orderId},
                success: function(data){
                    $('.order-accept').attr('display', None)
                    $('.order-reject').attr('display', None)
                    location.href = '/order/lorders/'
                },
                error: function(data){
                    alert('error')
                }
            })
        })
    });
    $(".order-reject").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-reject").attr("order-id", orderId);
        $(".modal-reject").on("click", function(){
            $.ajax({
                url: '/order/order_reject/',
                type: 'POST',
                dataType: 'json',
                data: {'order_id': orderId},
                success: function(data){
                    $('.order-accept').attr('display', None)
                    $('.order-reject').attr('display', None)
                    location.href = '/order/lorders/'
                },
                error: function(data){
                    alert('error')
                }
            })
        })
    });
    $.ajax({
        url: '/order/my_lorders/',
        dataType: 'json',
        type: 'GET',
        success: function(data){
            if(data.code == '200'){
                for(index in data.data){
                    order = data.data[index]

                    if(order.comment == null){
                        order.comment = '暂无评价'
                    }

                    ulNode = $('.orders-list')

                    liNode = $('<li></li>').attr('order-id', order.order_id)

                    div1Node = $('<div class="order-title"></div>')

                    h3Node = $('<h3>订单编号：' + order.order_id + '</h3>')

                    div11Node = $('<div class="fr order-operate"></div>')

                    if(order.status == 'WAIT_ACCEPT'){
                        button1Node = $('<button type="button" class="btn btn-success order-accept" data-toggle="modal" data-target="#accept-modal">接单</button>')

                        button2Node = $('<button type="button" class="btn btn-danger order-reject" data-toggle="modal" data-target="#reject-modal">拒单</button>')

                        div11Node.append(button1Node)
                        div11Node.append(button2Node)
                    }

                    div2Node = $('<div class="order-content"></div>')

                    imgNode = $('</img src="' + order.image + '">')

                    div21Node = $('<div class="order-text"></div>')

                    h31Node = $('<h3>' + order.house_title + '</h3>')

                    ul1Node = $('<ul></ul>')

                    li11Node = $('<li>创建时间：' + order.create_date + '</li>')

                    li12Node = $('<li>入住日期：' + order.begin_date + '</li>')

                    li13Node = $('<li>离开日期：' + order.end_date + '</li>')

                    li14Node = $('<li>合计金额：￥：' + order.amount + '(共' + order.days + '晚)</li>')

                    li15Node = $('<li>订单状态：<span>' + order.status + '</span></li>')

                    li16Node = $('<li>客户评价： ' + order.comment + '</li>')

                    ulNode.append(liNode)
                    liNode.append(div1Node)
                    div1Node.append(h3Node)
                    div1Node.append(div11Node)
                    liNode.append(div2Node)
                    div2Node.append(imgNode)
                    div2Node.append(div21Node)
                    div21Node.append(h31Node)
                    div21Node.append(ul1Node)
                    ul1Node.append(li11Node)
                    ul1Node.append(li12Node)
                    ul1Node.append(li13Node)
                    ul1Node.append(li14Node)
                    ul1Node.append(li15Node)
                    ul1Node.append(li16Node)
                }
            }
        },
        error: function(data){
            alert('error')
        }
    })
});