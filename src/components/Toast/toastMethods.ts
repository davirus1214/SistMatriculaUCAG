declare let bootstrap: any
export const showToast = (id: string) => {
    //aparece el toast
    const element = document.getElementById(id)
    const element2 = new bootstrap.Toast(element)
    element2.show()
}