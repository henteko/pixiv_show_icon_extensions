var script = function(){
    console.log(pixiv.user);
    jQuery('<div>', {
        id:'toMoyashipan', 
        'data-pixivuser':JSON.stringify(pixiv.user), 
        'data-pixivcontext':JSON.stringify(pixiv.context), 
        style:'display:none;'
    }).appendTo(jQuery('body'));
};

$(document).ready(function () {
    setTimeout (function() {
        location.href = 'javascript:('+script.toString()+')()';
    }, 100);
});

