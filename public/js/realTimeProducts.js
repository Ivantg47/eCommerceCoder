const socket = io()

const tabla = document.getElementById('listaTiempo')
const formProd = document.getElementById('formProd')

socket.on('lista', lista => {
    
    let lProducts 
    
    if (lista.code === 200) {
        lProducts = lista.result.payload.map(prod => 
            `<tr>
                <td style="display:none">${prod._id}</td>
                <td><img src="${prod.thumbnail[0]}" alt="No image" width="72" height="72" style="vertical-align:middle; object-fit: contain;"></td>
                <td>${prod.title}</td>
                <td>${prod.description}</td>
                <td align="right">${prod.price = new Intl.NumberFormat('es-MX',{ style: 'currency', currency: 'MXN' }).format(prod.price)}</td>
                <td style="text-align: center;"><button class="btn btn-outline-danger"  onclick="deletProduct('${prod._id}')"><i class="bi bi-x-lg" width="32" height="32" fill="red"></i></button></td>
            </tr>`
            ).join(' ')
    } else {
        lProducts = '<td align="center" colspan="5" height="100px">No hay productos registrados</td>'
    }
    
    tabla.innerHTML = lProducts
})

formProd.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(formProd);

    const response = await fetch("/api/products", {
        body: formData,
        method: "POST",        
    });
    if (response.status == 403) {
        Swal.fire({
            icon: 'error',
            text: 'No está autorizado para realizar esta acción.'
        })
        formProd.reset()
    } else {
        const res = await response.json()
    
        if(res.success){
            Swal.fire({
                icon: 'success',
                text: res.message
            })
            ocultar()
            formProd.reset()
            socket.emit('updateList')
        } else {
            Swal.fire({
                icon: 'error',
                text: res.message
            })
        }
    }
    
    

    //console.log(res);
})

// document.addEventListener('click', (e) => { 
    
//     if (e.target.matches('a')) {
//         e.preventDefault();
//       //e.preventImmediatePropagation(); // might not be necessary
//     }
// })

deletProduct = async (id) => {

    const response = await fetch(`/api/product/${id}`, {method: 'DELETE'}) 

    const res = await response.json()
    console.log(res);
    if(res.success){
        Swal.fire({
            icon: 'success',
            text: res.message
        })
        socket.emit('updateList')
    } else {
        Swal.fire({
            icon: 'error',
            text: res.message
        })
    }

    return false
}

ocultar = () => {
    const div = document.getElementById('ocultar')
    const bt = document.getElementById('bt')
    if (div.style.display === 'none') {
        div.style.display = 'block'
        bt.style.display = 'none'
    } else {
        div.style.display = 'none'
        bt.style.display = 'inline'
    }
}





