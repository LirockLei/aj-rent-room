function hrefBack() {
    history.go(-1);
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

function showErrorMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

$(document).ready(function(){
    $(".input-daterange").datepicker({
        format: "yyyy-mm-dd",
        startDate: "today",
        language: "zh-CN",
        autoclose: true
    });
    $(".input-daterange").on("changeDate", function(){
        var startDate = $("#start-date").val();
        var endDate = $("#end-date").val();

        if (startDate && endDate && startDate > endDate) {
            showErrorMsg();
        } else {
            var sd = new Date(startDate);
            var ed = new Date(endDate);
            days = (ed - sd)/(1000*3600*24) + 1;
            var price = $(".house-text>p>span").html();
            var amount = days * parseFloat(price);
            $(".order-amount>span").html(amount.toFixed(2) + "(共"+ days +"晚)");
        }
    });
    $.get('/order/booking/', function(data){
        var search = document.location.search
        id = search.split('=')[1]
        $.get('/home/detail/' + id + '/', function(data){
            var img_url = data.house.images[0]
            $('.house-info img').attr('src', img_url)

            $('.house-text h3').html(data.house.title)

            $('.house-text p').html('￥<span>' + data.house.price + '</span>/晚')

            $('.submit-btn').click(function(){
                var begin_date = $('#start-date').val()
                var end_date = $('#end-date').val()
                data = {'house_id': id, 'begin_date': begin_date, 'end_date': end_date}
                $.ajax({
                    url: '/order/my_order/',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function(data){
                        console.log(data)
                        if (data.code == '200'){
                            console.log(data)
                            location.href = '/order/orders/'
                        }
                    },
                    error: function(data){
                        alert('error')
                    }
                })
            })
        })
    })
})
