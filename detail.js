load('config.js');
function execute(url) {
    let browser = Engine.newBrowser();
    browser.launchAsync(url);
    
    let retry = 0;
    let doc;
    while (retry < 10) {
        sleep(1000);
        doc = browser.html();
        if (doc.select("h1").length > 0) {
            break;
        }
        retry++;
    }
    
    if (doc) {
        let name = doc.select("h1").first().text();
        let author = doc.select("h2").first().text().replace("Tác giả: ", "").trim();
        let cover = doc.select("img.book-cover-image").first().attr("src") || doc.select("img").first().attr("src");
        let desc = doc.select(".prose-sm").html();
        if(!desc) desc = doc.select("h3 + div").html();
        
        let ongoing = doc.text().indexOf("Đang ra") !== -1;
        
        let genres = [];
        doc.select("a[href*=/vi/categories/]").forEach(e => {
            genres.push({
                title: e.text(),
                input: e.attr("href"),
                script: "gen.js"
            });
        });

        browser.close();
        return Response.success({
            name: name,
            author: author,
            cover: cover,
            description: desc,
            genres: genres,
            ongoing: ongoing,
            host: BASE_URL
        });
    }
    browser.close();
    return null;
}
