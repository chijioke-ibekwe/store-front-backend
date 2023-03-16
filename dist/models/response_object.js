"use strict";
exports.__esModule = true;
exports.ResponseObject = exports.RequestStatus = void 0;
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["SUCCESSFUL"] = "Successful";
    RequestStatus["FAILED"] = "Failed";
})(RequestStatus = exports.RequestStatus || (exports.RequestStatus = {}));
var ResponseObject = /** @class */ (function () {
    function ResponseObject(status, message, data, page) {
        if (message === void 0) { message = null; }
        this.status = status;
        this.message = message;
        this.data = data;
        if (page !== undefined) {
            this.page = page;
        }
    }
    return ResponseObject;
}());
exports.ResponseObject = ResponseObject;
