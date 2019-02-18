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

function setStartDate() {
    var startDate = $("#start-date-input").val();
    if (startDate) {
        $(".search-btn").attr("start-date", startDate);
        $("#start-date-btn").html(startDate);
        $("#end-date").datepicker("destroy");
        $("#end-date-btn").html("离开日期");
        $("#end-date-input").val("");
        $(".search-btn").attr("end-date", "");
        $("#end-date").datepicker({
            language: "zh-CN",
            keyboardNavigation: false,
            startDate: startDate,
            format: "yyyy-mm-dd"
        });
        $("#end-date").on("changeDate", function() {
            $("#end-date-input").val(
                $(this).datepicker("getFormattedDate")
            );
        });
        $(".end-date").show();
    }
    $("#start-date-modal").modal("hide");
}

function setEndDate() {
    var endDate = $("#end-date-input").val();
    if (endDate) {
        $(".search-btn").attr("end-date", endDate);
        $("#end-date-btn").html(endDate);
    }
    $("#end-date-modal").modal("hide");
}

function goToSearchPage(th) {
    var url = "/home/search/?";
    url += ("aid=" + $(th).attr("area-id"));
    url += "&";
    var areaName = $(th).attr("area-name");
    if (undefined == areaName) areaName="";
    url += ("aname=" + areaName);
    url += "&";
    url += ("sd=" + $(th).attr("start-date"));
    url += "&";
    url += ("ed=" + $(th).attr("end-date"));
    location.href = url;
}

$(document).ready(function(){
    $(".top-bar>.register-login").show();
    $.ajax({
        url: '/user/index_info/',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            if(data.code == 200){
                console.log(data)
                for(index in data.data){
                    house = data.data[index]

                    var div1Node = $('<div class="swiper-slide"></div>')

                    var aNode = $('<a></a>').attr('href', '/home/detail/?id=' + house.id + '/')

                    var imgNode = $('<img/>').attr('src', house.image)

                    var div2Node = $('<div class="slide-title"><div>').html(house.title)

                    $('.swiper-wrapper').append(div1Node)
                    div1Node.append(aNode)
                    div1Node.append(div2Node)
                    aNode.append(imgNode)
                }
                var mySwiper = new Swiper ('.swiper-container', {
                    loop: true,
                    autoplay: 2000,
                    autoplayDisableOnInteraction: false,
                    pagination: '.swiper-pagination',
                    paginationClickable: true
                });
            }
        }
    })
    $.ajax({
        url: '/home/area_info/',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            if(data.code == '200'){
                console.log(data)
                for(index in data.data){
                    var area = data.data[index]

                    var aNode = $('<a area-id="' + area.area_id + '">' + area.area_name + '</a>')

                    $('.area-list').append(aNode)
                }
                $(".area-list a").click(function(e){
                    $("#area-btn").html($(this).html());
                    $(".search-btn").attr("area-id", $(this).attr("area-id"));
                    $(".search-btn").attr("area-name", $(this).html());
                    $("#area-modal").modal("hide");
//                    var id = $('.search-btn').attr('area-id')
//                    var name = $('.search-btn').attr('area-name')
//                    console.log(id)
//                    console.log(name)
                });
            }
        }
    })
    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);               //当窗口大小变化的时候
    $("#start-date").datepicker({
        language: "zh-CN",
        keyboardNavigation: false,
        startDate: "today",
        format: "yyyy-mm-dd"
    });
    $("#start-date").on("changeDate", function() {
        var date = $(this).datepicker("getFormattedDate");
        $("#start-date-input").val(date);
    });
})