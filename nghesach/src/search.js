load('config.js');
function execute(key, page) {
    if (!page) page = '1';
    let browser = Engine.newBrowser();
    browser.launchAsync(BASE_URL + "/vi/tim-kiem?q=" + encodeURIComponent(key));
    
    let retry = 0;
    let doc;
    let list = [];
    while (retry < 10) {
        sleep(1000);
        doc = browser.html();
        
        let items = doc.select("a[href*=/vi/reading/]");
        if (items.length > 0 && doc.text().indexOf("Đang tải") === -1) {
            items.forEach(e => {
                let img = e.select("img").first();
                if(img) {
                    list.push({
                        name: img.attr("alt") || e.text(),
                        link: e.attr("href"),
                        cover: img.attr("src"),
                        host: BASE_URL
                    });
                }
            });
            if (list.length > 0) break;
        }
        retry++;
    }
    browser.close();
    
    if(list.length > 0) return Response.success(list);
    return null;
}
