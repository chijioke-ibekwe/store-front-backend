"use strict";
exports.__esModule = true;
function paginate(req, count) {
    var page = req.query.page;
    var size = req.query.size;
    if (page === undefined)
        page = 1;
    if (size === undefined)
        size = 10;
    var limit = size;
    var offset = (page - 1) * size;
    var totalElements = count.count;
    var totalPages = Math.ceil(totalElements / size);
    var pageObject = {
        size: size,
        totalElements: totalElements,
        totalPages: totalPages,
        number: page
    };
    return {
        page: pageObject,
        limit: limit,
        offset: offset
    };
}
exports["default"] = paginate;
