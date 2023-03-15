import { Request } from 'express';
import { Page } from '../../models/response_object';
import { Count } from "../../models/user";

export interface PageDetails {
    page: Page;
    limit: number;
    offset: number;
}

function paginate (req: Request, count: Count): PageDetails {
    
    let page: number | undefined = (req.query.page as unknown) as number;
    let size: number | undefined = (req.query.size as unknown) as number;

    if(page === undefined)
        page = 1;

    if(size === undefined)
        size = 10;

    const limit = size;
    const offset = (page - 1) * size;
    const totalElements = count.count;
    const totalPages = Math.ceil(totalElements/size);

    const pageObject: Page = {
        size: size,
        totalElements: totalElements,
        totalPages: totalPages,
        number: page
    }

    return {
        page: pageObject,
        limit: limit,
        offset: offset
    }
}

export default paginate;