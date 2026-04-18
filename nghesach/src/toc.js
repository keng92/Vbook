load('config.js');
function execute(url) {
    let browser = Engine.newBrowser();
    browser.launchAsync(url);
    
    let retry = 0;
    let doc;
    let foundToc = false;
    while (retry < 15) {
        sleep(1000);
        doc = browser.html();
        if (doc.select("button:contains(Danh sách)").length > 0 || doc.select("button:contains(Danh Sách)").length > 0) {
            browser.callJs("var btns = document.querySelectorAll('button'); for(var i=0; i<btns.length; i++) { if(btns[i].innerText.toLowerCase().includes('danh sách')) { btns[i].click(); break; } }", 500);
            sleep(1500);
            doc = browser.html(); 
            if (doc.select("a[href*=/vi/reading/]").length > 5) {
                foundToc = true;
                break;
            }
        }
        retry++;
    }
    
    if (foundToc) {
        let list = [];
        // Lấy danh sách link chứa slug của truyện (/vi/reading/slug/...)
        let slug = url.split('/').pop();
        let chapterLinks = doc.select("a[href*=/vi/reading/" + slug + "/]");
        chapterLinks.forEach(e => {
            list.push({
                name: e.text(),
                url: e.attr("href"),
                host: BASE_URL
            });
        });
        browser.close();
        // Xóa trùng lặp nếu có do React
        let uniqueList = [];
        let seen = {};
        for(let i=0; i<list.length; i++) {
            if(!seen[list[i].url]){
                seen[list[i].url] = true;
                uniqueList.push(list[i]);
            }
        }
        return Response.success(uniqueList);
    }
    
    browser.close();
    return null;
}
