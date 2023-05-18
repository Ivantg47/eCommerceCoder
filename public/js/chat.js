const socket = io()

let user
const formMensaje = document.getElementById('formMensaje')
const username = document.getElementById('username').innerText

Swal.fire({
    title: 'Bienvenido al chat' + username,
    allowOutsideClick: false,
}).then(result => {
    socket.emit('authenticated', user)

})

// console.log(username);
// window.onload = () => {socket.emit('authenticated',username)}

formMensaje.addEventListener("submit", async (e) => {
    e.preventDefault()
    
    const formData = new FormData(formMensaje)
    
    let mensajes = {}
    for (const field of formData.entries()) {
        mensajes[field[0]] = field[1];
    }
    
    const response = await fetch("/api/chat", {
        body: JSON.stringify(mensajes),
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        }       
    });
    formMensaje.reset()
})

socket.on('messageLogs', data => {
    let log = document.getElementById('messageLogs')
    const user = document.getElementById('email').value
    
    let isScrolledToBottom = log.scrollHeight - log.clientHeight <= log.scrollTop + 1;
    let messages = '' 
    
    if(data.code === 200){
        const message = data.result.payload
        message.forEach(message => {
            if(/*cont % 2 === 0*/user !== message.user){
                messages += `<div class="container container2">
                                <span><b>${message.user}</b></span>
                                <div>${message.message}</div>
                            </div>`
            } else {
                messages += `<div class="container container2 darker">
                                <span><b>${message.user}</b></span>
                                <div>${message.message}</div>
                            </div>`
            }
            //cont++
        })
    } else {
        messages = 'No hay mensajes'
    }
    
    log.innerHTML = messages
    // console.log(`posB: ${out.scrollHeight} - ${out.clientHeight} = ${out.scrollHeight - out.clientHeight} <= ${out.scrollTop + 1}`);
    // console.log(`posB1: ${log.scrollHeight} - ${log.clientHeight} = ${log.scrollHeight - log.clientHeight} <= ${log.scrollTop + 1}`);

    
    if(isScrolledToBottom) log.scrollTop = log.scrollHeight - log.clientHeight;
})

socket.on('allChat', user => {
    Swal.fire({
        text: user + ' ingreso a la sala',
        toast: true,
        position: 'top-right'
    })
})

socket.on('mensaje', data => {
    let log = document.getElementById('messageLogs')
    const user = document.getElementById('email').value
    
    let isScrolledToBottom = log.scrollHeight - log.clientHeight <= log.scrollTop + 1;
    
    let messages = ''
    //let cont = 0
    data.forEach(message => {
        if(/*cont % 2 === 0*/user !== message.user){
            messages += `<div class="container container2">
                            <span><b>${message.user}</b></span>
                            <div>${message.message}</div>
                        </div>`
        } else {
            messages += `<div class="container container2 darker">
                            <span><b>${message.user}</b></span>
                            <div>${message.message}</div>
                        </div>`
        }
        //cont++
    })
    
    log.innerHTML = messages

    if(isScrolledToBottom) log.scrollTop = log.scrollHeight - log.clientHeight;
})
