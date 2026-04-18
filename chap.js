load('config.js');
function execute(url) {
    let browser = Engine.newBrowser();
    browser.launchAsync(url);
    
    let retry = 0;
    let doc;
    while (retry < 15) {
        sleep(1000);
        doc = browser.html();
        if (doc.select("p").length > 2 || doc.text().indexOf("Nội dung cho") !== -1) {
            break;
        }
        retry++;
    }
    
    if (doc) {
        let contentContainer = doc.select("article, .prose, main, #__next");
        let htmlElement = contentContainer.length > 0 ? contentContainer : doc.select("body");
        
        // Dọn dẹp DOM
        htmlElement.select("script, style, iframe, button, nav, header, footer, a, svg, img").remove();
        
        let content = "";
        let paragraphs = htmlElement.select("p, h1, h2, h3, h4, h5, h6");
        paragraphs.forEach(p => {
            let t = p.text().trim();
            if (t.length > 0) {
                content += "<p>" + t + "</p>";
            }
        });
        
        if (!content) {
             content = htmlElement.html();   
        }

        browser.close();
        return Response.success(content);
    }
    browser.close();
    return null;
}
