export enum RequestStatus{
    SUCCESSFUL = 'Successful',
    FAILED = 'Failed'
}

export type Page = {
    size: number;
    totalElements: number,
    totalPages: number,
    number: number;
}

export class ResponseObject {
    status: RequestStatus;
    message: string | null;
    data: Array<object> | object;
    page?: Page;

    constructor(status: RequestStatus, message: string | null = null, data: Array<object> | object, page?: Page) {
        this.status = status;
        this.message = message;
        this.data = data;

        if(page !== undefined){
            this.page = page;
        }
    }
}