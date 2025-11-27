export class ErrorResponse extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
