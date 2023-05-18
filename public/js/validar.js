$().ready(function () {
    
    $("#registro").validate({
        
        rules: {
            first_name: "required",
            last_name: "required",
            date: "required", 
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 8
            },
            confirm_password: {
                required: true,
                minlength: 8,
                equalTo: "#password"
            },
        },
        messages:  {
            first_name: "Favor de introducir un nombre",
            last_name: "Favor de introducir un apellido",
            date: "Favor de introducir fecha nacimiento",
            email: {
                required: "Favor de introducir correo",
                email: "Introduzca un correo valido"
            },
            password: {
                required: "Favor de introducir una contraseña",
                minlength: "La contraseña debe ser mayor a 8 caracteres"
            },
            confirm_password: {
                required: "Favor de introducir contraseña",
                minlength: "La contraseña debe ser mayor a 8 caracteres",
                equalTo: "La contraseña debe ser igual a la anterior"
            }
        },
        errorPlacement: function (error, element) {               
            error.insertAfter(element.closest('div'));               
        }
    });
    
    $("#login").validate({
        
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true
            }
        },
        messages:  {
            email: {
                required: "Favor de introducir correo",
                email: "Introduzca un correo valido"
            },
            password: {
                required: "Favor de introducir contraseña"
            }
        },
        errorPlacement: function (error, element) {               
            error.insertAfter(element.closest('div'));               
        }
    });

    $("#recuperar").validate({
        
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true
            },
            confirm_password: {
                required: true,
                minlength: 8,
                equalTo: "#password"
            },
        },
        messages:  {
            email: {
                required: "Favor de introducir correo",
                email: "Introduzca un correo valido"
            },
            password: {
                required: "Favor de introducir una contraseña",
                minlength: "La contraseña debe ser mayor a 8 caracteres"
            },
            confirm_password: {
                required: "Favor de introducir contraseña",
                minlength: "La contraseña debe ser mayor a 8 caracteres",
                equalTo: "La contraseña debe ser igual a la anterior"
            }
        },
        errorPlacement: function (error, element) {               
            error.insertAfter(element.closest('div'));               
        }
    });
})
