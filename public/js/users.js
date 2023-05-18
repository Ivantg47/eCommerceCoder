upgradeUser = async (id) => {
    
    const response = await fetch(`/api/users/premium/${id}`, {method: 'GET'})
    
    if (response.status == 200) {
        alert('Role modificado')
        window.location.reload();
    } else if (response.status == 400){
        alert('El usuario no cuenta con todos los documentos para cambiar a premium')
    } else if (response.status == 401){
        alert('Los usuarios con role de administrador no puede cambiar a premium')
    } else {
        alert('Error al modificar role')
    }
}

deleteUser = async (id) => {
    
    const response = await fetch(`/api/users/${id}`, {method: 'DELETE'})
    
    if (response.status == 200) {
        alert('Usuario eliminado')
        window.location.reload();
    } else {
        alert('Error al eliminar')
    }
}

formDocs.addEventListener("submit", async (e) => {
    e.preventDefault()
    const id = document.getElementById('id').textContent
    const formData = new FormData(formDocs);

    const url = `/api/users/${id}/documents`
    // console.log(product);
    // console.log(formData);
    const response = await fetch(url, {
        method: "POST",        
        body: formData,
    });

    const res = await response.json()
    
    if(res.status == "success"){
        Swal.fire({
            icon: 'success',
            text: res.message
        })
        formDocs.reset()
    } else {
        Swal.fire({
            icon: 'error',
            text: res.message
        })
    }
    

    //console.log(res);
})