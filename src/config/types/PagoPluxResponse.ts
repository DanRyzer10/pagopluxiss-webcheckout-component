export interface PagoPluxResponse{
    code: number;
    detail: {
        idTransaction: string;
        sessionId: string;
        tkn: string;
        url?:string;
        parameters:object[]
        tknky: string;
        tkniv: string;
    };
    response: {
        code: number;
        description: string;
        detail: {
            idTransaction: string;
            sessionId: string;
            tkn: string;
            tknky: string;
            tkniv: string;
        };
        status: string;
    };
}