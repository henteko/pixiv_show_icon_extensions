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
            setIcon(data);
        });

        $("div.rating").click(function(e) {
            //未評価の場合のみ実行
            if(pixiv_context.rated == false) {
                //投票する
                var user_url = "http://www.pixiv.net/member.php?id=" + pixiv_user.id;
                $.get(user_url, function(data) {
                    var img = $(data).find(".profile_area img")[0];
                    var img_url = $(img).attr("src");
                    var user_name = $(data).find(".profile_area h2").text();
                    var url = BASE_URL + 
                        "/vote?illust_id=" + pixiv_context.illustId + 
                        "&user_id=" + pixiv_user.id + 
                        "&point=" + 10 + 
                        "&user_icon_url=" + img_url + 
                        "&user_name=" + user_name;

                    $.get(url, function(data) {
                        if(data.success == true) {
                            //成功時
                            icon_data = [{user_icon_url: img_url, user_id: pixiv_user.id, user_name: user_name}];
                            setIcon(icon_data);
                            $("div.rating").unbind();
                        }
                    });

                });
            }
        });
    }, 100);
});

function setIcon(data) {
    var $score = $("section.score");
    var $vote_users = $score.find(".vote_user");
    if($vote_users.length == 0) {
        $vote_users = $("<div>", {
            class: "vote_user"
        });
    }

    $.each(data, function(id) {
        var $a = $("<a>", {
            href: "http://www.pixiv.net/member.php?id=" + data[id].user_id,
            class: "ui-tooltip",
            "data-tooltip": data[id].user_name ? data[id].user_name : "名無しさん"
        });
        var $img = $("<img>",{
            id: "rating_user_icon",
            src: data[id].user_icon_url
        });
        $a.append($img);
        $vote_users.prepend($a);
    });
    $score.append($vote_users);
}
