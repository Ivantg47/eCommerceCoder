addProduct = async (cid, pid) => {
    //console.log('add', pid);
    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {method: 'POST'})
    console.log(response);
    if (response.status == 200) {
        alert('Producto añadido')
    } else if (response.status == 401){
        alert(response.statusText)
    } else {
        alert('Error al añadir')
    }
    
}

deleteProduct = async (pid) => {
    //console.log('add', pid);
    const cid = document.getElementById('cart').innerText
    //console.log(cid);
    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {method: 'DELETE'})
    console.log(response);
    
    if (response.status == 200) {
        alert('Producto eliminado')
        window.location.reload();
    } else if (response.status == 401){
        alert(response.statusText)
    } else {
        alert('Error al eliminar')
    }
    
}

addProducts = async (cid, pid) => {
    //console.log('add', pid);
    const formData = new FormData(document.getElementById('addProduct'));

    const body = {};

    for (const field of formData.entries()) {
        body[field[0]] = field[1];
    }

    //console.log(body);

    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
        body: JSON.stringify(body),
        method: "POST",  
        headers: {
            "Content-Type": "application/json",
        },      
    });
    //console.log(response);
    if (response.status == 200) {
        alert('Producto añadido')
    } else if (response.status == 401){
        alert(response.statusText)
    }else {
        alert('Error al añadir')
    }
    
}



//btn btn-outline-dark mt-auto