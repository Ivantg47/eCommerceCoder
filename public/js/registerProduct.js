const tabla = document.getElementById('listaTiempo')

formProd.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(formProd);

    // console.log(product);
    console.log(formData);
    const response = await fetch("/api/product", {
        body: formData,
        method: "POST",        
    });

    const res = await response.json()
    console.log(res);
    if(res.success){
        Swal.fire({
            icon: 'success',
            text: res.message
        })
        formProd.reset()
        socket.emit('updateList')
    } else {
        Swal.fire({
            icon: 'error',
            text: res.message
        })
    }
    

    //console.log(res);
})