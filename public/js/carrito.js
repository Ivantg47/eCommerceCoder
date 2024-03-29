addProduct = async (cid, pid) => {
    //console.log('add', pid);
    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {method: 'POST'})
    
    if (response.status == 200) {
        let cont = document.getElementById('cartProds').innerHTML
        document.getElementById('cartProds').innerHTML = parseInt(cont)+1
        alert('Producto añadido')
    } else if (response.status == 401){
        alert(response.statusText)
    } else if (response.status == 403){
        alert("El producto no puede ser adquirido por el propietario")
    } else if (response.status == 404){
        window.location.replace("/session/login");
    } else {
        alert('Error al añadir')
    }
    
}

deleteProduct = async (pid) => {
    //console.log('add', pid);
    const cid = document.getElementById('cartid').innerText
    //console.log(cid);
    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {method: 'DELETE'})
    
    if (response.status == 200) {
        alert('Producto eliminado')
        window.location.reload();
    } else if (response.status == 401){
        alert(response.statusText)
    } else if (response.status == 404){
        window.location.replace("/session/login");
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

    //console.log("cart:", cid, " prod: ", pid);

    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
        body: JSON.stringify(body),
        method: "POST",  
        headers: {
            "Content-Type": "application/json",
        },      
    });
    //console.log(response);
    if (response.status == 200) {
        let cont = document.getElementById('cartProds').innerHTML
        document.getElementById('cartProds').innerHTML = parseInt(cont)+parseInt(document.getElementById('quantity').value)
        alert('Producto añadido')
    } else if (response.status == 401){
        alert(response.statusText)
    } else if (response.status == 403){
        alert("El producto no puede ser adquirido por el propietario")
    } else if (response.status == 404){
        window.location.replace("/session/login");
    } else {
        alert('Error al añadir')
    }
    
}