import multer from 'multer'
const storage2 = multer.memoryStorage()
const storage = multer.diskStorage({
    destination: function(req, file, cb) { 

        if (file.fieldname == 'thumbnail') {
            cb(null, '../upload/img/products')
        } else if (file.fieldname == 'profiles') {
            console.log("pro");
            cb(null, '/upload/img/profiles')
        } else if (file.fieldname == 'domicilio') {
            console.log("dom");
            cb(null, '../upload/docs/domicilio')
        } else if (file.fieldname == 'estadoCuenta') {
            console.log("estado");
            cb(null, '../upload/docs/estadoCuenta')
        }
    },
    filename: function(req, file, cb) { 
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${file.fieldname}-${uniqueSuffix}`)
    }
})

const uploader = multer({storage: storage2})

export default uploader