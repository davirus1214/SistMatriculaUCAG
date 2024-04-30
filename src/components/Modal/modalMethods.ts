declare let bootstrap : any

export const closeModal = async (id: string) => {
    const elem = document.getElementById(id)
    console.log(elem)
    const elem2 = bootstrap.Modal.getInstance(elem)
    if(elem2){
        console.log(elem2,'entraaaa')
        await elem2.hide(elem)
               
    }


    
}
