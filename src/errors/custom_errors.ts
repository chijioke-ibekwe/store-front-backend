export class InvalidAuthorizationError extends Error {

    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, InvalidAuthorizationError.prototype);
    }
}