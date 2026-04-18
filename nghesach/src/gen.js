load('config.js');
function execute(url, page) {
    if (!page) page = '1';
    let fullUrl = url + "?page=" + page;
    let browser = Engine.newBrowser();
    browser.launchAsync(fullUrl);
    
    let retry = 0;
    let list = [];
    while (retry < 10) {
        sleep(1000);
        let doc = browser.html();
        let items = doc.select("a[href*=/vi/reading/]");
        if (items.length > 0 && doc.text().indexOf("Đang tải") === -1) {
            // Find book items
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
            break;
        }
        retry++;
    }
    browser.close();
    
    if (list.length > 0) {
        return Response.success(list, parseInt(page) + 1 + "");
    }
    return null;
}
