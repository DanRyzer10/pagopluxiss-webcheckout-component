export interface StrapiCountrieResponse {
    data: StrapiCountrie[],
    meta: {
        pagination:{
            page:number,
            pageSize:number,
            pageCount:number,
            total:number
        }
    }
}

interface StrapiCountrie {
    id:number,
    attributes:{
        name:string,
        code:string,
        number:string
    }
}