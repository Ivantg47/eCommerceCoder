const socket = io()

let user
const formMensaje = document.getElementById('formMensaje')

Swal.fire({
    title: 'Identificate',
    input: 'email',
    inputPlaceholder: 'Enter your email address',
    allowOutsideClick: false,
}).then(result => {
    user = result.value
    let TxtUserName = document.getElementById('username')
    document.getElementById('user').value = user
    TxtUserName.innerHTML = 'Bienvenido ' + user
    socket.emit('authenticated', user)

})

formMensaje.addEventListener("submit", async (e) => {
    e.preventDefault()
    
    const formData = new FormData(formMensaje)
    const mensaje = {};

    for (const field of formData.entries()) {
        mensaje[field[0]] = field[1];
    }
    
    const response = await fetch("/api/chat", {
        body: JSON.stringify(mensaje),
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        }       
    });
    formMensaje.reset()
    console.log(response);
})

socket.on('messageLogs', data => {
    let log = document.getElementById('messageLogs')
    const user = document.getElementById('user').value
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
    console.log(`posB: ${out.scrollHeight} - ${out.clientHeight} = ${out.scrollHeight - out.clientHeight} <= ${out.scrollTop + 1}`);
    console.log(`posB1: ${log.scrollHeight} - ${log.clientHeight} = ${log.scrollHeight - log.clientHeight} <= ${log.scrollTop + 1}`);

    
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
    const user = document.getElementById('user').value
    let isScrolledToBottom = log.scrollHeight - log.clientHeight <= log.scrollTop + 1;
    //console.log(log);
    let messages = ''
    //let cont = 0
    data.forEach(message => {
        if(/*cont % 2 === 0*/user !== message.user){
            messages += `<div class="container">
                            <span><b>${message.user}</b></span>
                            <div>${message.message}</div>
                        </div>`
        } else {
            messages += `<div class="container darker">
                            <span><b>${message.user}</b></span>
                            <div>${message.message}</div>
                        </div>`
        }
        //cont++
    })
    
    log.innerHTML = messages

    if(isScrolledToBottom) log.scrollTop = log.scrollHeight - log.clientHeight;
})
