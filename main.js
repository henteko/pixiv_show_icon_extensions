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
        //backgroundとの通信
        var port = chrome.extension.connect({ "name": "test" });
        var pixiv_user = $.parseJSON($("#toPixivData").attr("data-pixivuser"));
        var pixiv_context =  $.parseJSON($("#toPixivData").attr("data-pixivcontext"));

        port.postMessage({ "illustId": pixiv_context.illustId });
        port.onMessage.addListener(function(res) {
            var $score = $("section.score");
            var $vote_users = $("<div>", {
                class: "vote_user"
            });
            $.each(res.data, function(id) {
                var $img = $("<img>",{
                    id: "rating_user_icon",
                    src: res.data[id].user_icon_url
                });
                $vote_users.append($img);
            });

            $score.append($vote_users);
        });
    }, 100);
});


