function hrefBack() {
    history.go(-1);
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

$(document).ready(function(){
//    var mySwiper = new Swiper ('.swiper-container', {
//        loop: true,
//        autoplay: 2000,
//        autoplayDisableOnInteraction: false,
//        pagination: '.swiper-pagination',
//        paginationType: 'fraction'
//    })
    $(".book-house").show();

    $.get('/home/detail/', function(data){
            var search = document.location.search
            id = search.split('=')[1]
            $.get('/home/detail/' + id + '/', function(data){
                    console.log(data)
                    var banner_image = ''
                    for(var i=0; i<data.house.images.length; i++){
                        banner_li = '<li class="swiper-slide"><img src="' + data.house.images[i] + '"></li>'
                        banner_image += banner_li
                    }
                    $('.swiper-wrapper').html(banner_image)

                    var mySwiper = new Swiper ('.swiper-container', {
                        loop: true,
                        autoplay: 2000,
                        autoplayDisableOnInteraction: false,
                        pagination: '.swiper-pagination',
                        paginationType: 'fraction'
                    })

                    $('.house-price').html('￥<span>' + data.house.price + '</span>/晚')

                    $('.house-info-list li').html(data.house.address)

                    $('.house-title').html(data.house.title)

                    $('.landlord-name').html('房东： <span>' + data.house.user_name + '</span>')

                    $('.landlord-pic').html('<img src="/static/media/' + data.house.user_avatar + '">')

                    $('.house-type .icon-text').html('<h3>出租' + data.house.room_count + '</h3><p>房屋面积:' + data.house.acreage + '平米</p><p>房屋户型:' + data.house.unit + '</p>')

                    $('#house-capacity').html('<h3>宜住' + data.house.capacity + '人</h3>')

                    $('#house-bed').html('<h3>卧床配置</h3><p>' + data.house.beds + '</p>')

                    var house_info_style = '<li>收取押金<span>' + data.house.deposit + '</span></li>'
                    house_info_style += '<li>最少入住天数<span>' + data.house.min_days + '</span></li>'
                    house_info_style += '<li>最多入住天数<span>' + data.house.max_days + '</span></li>'
                    $('.house-info-style').html(house_info_style)

                    var house_facility_list = ''
                    for(var i=0; i<data.house.facilities.length; i++){
                        house_facility_list += '<li><span class="' + data.house.facilities[i].css + '"></span>' + data.house.facilities[i].name + '</li>'
                    }
                    $('.house-facility-list').html(house_facility_list)

                    $('.book-house').attr('href', '/order/booking/?id=' + data.house.id)
            })
    })
})