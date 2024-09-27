export const convertToDeferredOptions = (options:any[]) =>{
    return options.map((option)=>{
        return {
            code:option,
            name:`${option} Meses`,
        }
    })
}