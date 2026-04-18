load('config.js');
function execute() {
    return Response.success([
        {title: "Mới cập nhật", input: BASE_URL + "/vi/tat-ca", script: "gen.js"},
        {title: "Sách Văn Học", input: BASE_URL + "/vi/sach-van-hoc", script: "gen.js"},
        {title: "Truyện hoàn thành", input: BASE_URL + "/vi/truyen-hoan-thanh", script: "gen.js"}
    ]);
}
