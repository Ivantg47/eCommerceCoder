import { UserService } from "../../repositories/index_repository.js";
import logger from "../../utils/logger.js";
import MiRouter from "../router.js";

export default class UserViewRouter extends MiRouter {

    init () {

        this.get('/profile/documents', ["PUBLIC"], async (req, res) => {
            try {
                const user = req.session?.user || req.user
                user.id = user?._id
                res.render('user/documentos', {title: "Documentos", user})
            
            } catch (error) {
                console.error(error);
                logger.error(error.message)
            }
        })

        this.get('/', ["PUBLIC"], async (req, res) => {
            try {
                const user = req.session?.user || req.user
                user.id = user?._id
                
                const users = await UserService.getUsers()
                users.result.status = users.result.status == 'success' ? true : false

                users.result.payload.forEach(user => {
                    user.premium = user.role == 'premium' ? true : false
                });
                
                res.render('user/users', {title: "Usuarios", users: users.result, user})

            } catch (error) {
                console.error(error);
                logger.error(error.message)
            }
        })
    }
}