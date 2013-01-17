(function(undefined) {
    chrome.extension.onConnect.addListener(function(port) {
        port.onMessage.addListener(function(req) {
            //illustIdで検索
            $.getJSON("http://henteko07.com:4000/search/" + req.illustId, 
                function(data, status) {
                    port.postMessage({"data": data});
            });
        });
    });
})();
