import uploader from "../../dao/multer.js";
import { UserService } from "../../repositories/index_repository.js";
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage'
import storage from '../../modules/storage.js'
import logger from "../../utils/logger.js";
import MiRouter from "../router.js";

export default class UserRouter extends MiRouter {
    init () {

        this.get('/', ["ADMIN"], async (req, res) => {
            try {
                
                const result = await UserService.getUsers()
                
                return res.status(result.code).send(result.result)

            } catch (error) {
                console.log(error);
                res.status(500).send({status: "Error", message: error.message , payload: error})
            }
        })

        this.get('/premium/:uid', ["ADMIN"], async (req, res) => {
            try {
                const { uid } = req.params
                
                const result = await UserService.setUserRole(uid)

                return res.status(result.code).send(result.result)    

            } catch (error) {
                res.status(500).send({status: "Error", message: error.message , payload: error})
            }
            
            
        })

        this.post('/:uid/documents', ["USER", "PREMIUM"], uploader.fields([{name:'identificacion', maxCount:1}, {name:'domicilio', maxCount:1}, {name:'estadoCuenta', maxCount:1}]), async (req, res) => {
            try {
                const { uid } = req.params
                const file = req.files
                let conteo = 0
                const user = req.user
                const docs = []
                //logger.debug(user)
                if(file.identificacion){
                    
                    conteo++
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E2)
                    const nombre = `${user.first_name}${user.last_name}-${uniqueSuffix}`
                    const storageRef = ref(storage, `/docs/identificacion/${nombre}`)
                    const metadata = { contentType: file.identificacion[0].mimetype, name: nombre}
                    const snapshot = await uploadBytesResumable(storageRef, file.identificacion[0].buffer, metadata)
                    
                    const downloadURL = await getDownloadURL(snapshot.ref);
                    const nameFile = { name: file.identificacion[0].fieldname, reference: downloadURL }
                    
                    if (user.documents.length != 0) {
                        for (let i = 0; i < user.documents.length; i++) {
                            if (user.documents[i].name == 'identificacion') {
                                const fileUrl = user.documents[i].reference    
                                const fileRef = ref(storage, fileUrl);
                                await deleteObject(fileRef)
                
                            }
                        }    
                    } 
                    
                    docs.push(nameFile)
                    
                }

                if(file.domicilio){
                    
                    conteo++
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E2)
                    const nombre = `${user.first_name}${user.last_name}-${uniqueSuffix}`
                    const storageRef = ref(storage, `/docs/domicilio/${nombre}`)
                    const metadata = { contentType: file.domicilio[0].mimetype, name: nombre}
                    const snapshot = await uploadBytesResumable(storageRef, file.domicilio[0].buffer, metadata)
                    
                    const downloadURL = await getDownloadURL(snapshot.ref);
                    const nameFile = { name: file.domicilio[0].fieldname, reference: downloadURL }
                    
                    if (user.documents.length != 0) {
                        for (let i = 0; i < user.documents.length; i++) {
                            if (user.documents[i].name == 'domicilio') {
                                const fileUrl = user.documents[i].reference    
                                const fileRef = ref(storage, fileUrl);
                                await deleteObject(fileRef)
                
                            }
                        }    
                    } 
                    
                    docs.push(nameFile)
                    
                }

                if(file.estadoCuenta){
                    conteo++
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E2)
                    const nombre = `${user.first_name}${user.last_name}-${uniqueSuffix}`
                    const storageRef = ref(storage, `/docs/estadoCuenta/${nombre}`)
                    const metadata = { contentType: file.estadoCuenta[0].mimetype, name: nombre}
                    const snapshot = await uploadBytesResumable(storageRef, file.estadoCuenta[0].buffer, metadata)
                    
                    const downloadURL = await getDownloadURL(snapshot.ref);
                    const nameFile = { name: file.estadoCuenta[0].fieldname, reference: downloadURL }

                    if (user.documents.length != 0) {
                        for (let i = 0; i < user.documents.length; i++) {
                            if (user.documents[i].name == 'estadoCuenta') {
                                const fileUrl = user.documents[i].reference    
                                const fileRef = ref(storage, fileUrl);
                                await deleteObject(fileRef)
                            }
                        }    
                    }
                    
                    docs.push(nameFile)
                    
                }
                
                const result = await UserService.updateUser(uid, {documents: docs})

                res.status(200).send({status: "success", message: `Se cargaron: ${conteo} archivos`, payload: result})   

            } catch (error) {
                res.status(500).send({status: "Error", message: error.message , payload: error})
            }
        })

        this.delete('/', ["ADMIN"], async (req, res) => {
            try {
                
                const result = await UserService.limpiar()
                //logger.debug(result)
                return res.status(result.code).send(result.result)

            } catch (error) {
                res.status(500).send({status: "Error", message: error.message , payload: error})               
            }
        })

        this.delete('/:uid', ["ADMIN"], async (req, res) => {
            try {
                const { uid } = req.params
                console.log('premiun: ', uid);
                const result = await UserService.deleteUser(uid)
                logger.debug(result)
                return res.status(result.code).send(result.result)

            } catch (error) {
                res.status(500).send({status: "Error", message: error.message , payload: error})               
            }
        })
        
    }
}