var script = function(){
    jQuery('<div>', {
        id:'toPixivData', 
        'data-pixivuser':JSON.stringify(pixiv.user), 
        'data-pixivcontext':JSON.stringify(pixiv.context), 
        style:'display:none;'
    }).appendTo(jQuery('body'));
};

$(document).ready(function () {
    location.href = 'javascript:('+script.toString()+')()';

    setTimeout(function () {
        var pixiv_user = $.parseJSON($("#toPixivData").attr("data-pixivuser"));
        var pixiv_context =  $.parseJSON($("#toPixivData").attr("data-pixivcontext"));
        var BASE_URL = "http://henteko07.com:4000";

        //そのページの評価を取得
        $.getJSON(BASE_URL + "/search/" + pixiv_context.illustId, function(data, status) {
            var $score = $("section.score");
            var $vote_users = $("<div>", {
                class: "vote_user"
            });
            $.each(data, function(id) {
                var $img = $("<img>",{
                    id: "rating_user_icon",
                    src: data[id].user_icon_url
                });
                $vote_users.append($img);
            });
            $score.append($vote_users);
        });

        $("div.rating").click(function(e) {
            //未評価の場合のみ実行
            if(pixiv_context.rated == false) {
                //投票する
                var user_url = "http://www.pixiv.net/member.php?id=" + pixiv_user.id;
                $.get(user_url, function(data) {
                    var img = $(data).find(".profile_area img")[0];
                    var img_url = $(img).attr("src");
                    var url = BASE_URL + 
                        "/vote?illust_id=" + pixiv_context.illustId + 
                        "&user_id=" + pixiv_user.id + 
                        "&point=" + 10 + 
                        "&user_icon_url=" + img_url; 

                    $.get(url, function(data) {
                        if(data.success == true) {
                            //成功時
                            setIcon(img_url);
                            $("div.rating").unbind();
                        }
                    });

                });
            }
        });
    }, 100);
});

function setIcon(img_url) {
    var $score = $("section.score");
    var $vote_users = $score.find(".vote_user") ? $score.find(".vote_user") : $("<div>", {
        class: "vote_user"
    });
    var $img = $("<img>",{
        id: "rating_user_icon",
        src: img_url
    });
    $vote_users.append($img);
    $score.append($vote_users);
}
