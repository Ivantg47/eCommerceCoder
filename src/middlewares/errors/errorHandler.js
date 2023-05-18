import EErrors from "../../services/errors/enums.js";

export default (error, req, res, next) => {
    console.error(error.cause);
    switch (error.code) {
        case EErrors.ROUTING_ERROR:
            res.send({status: "error", error: error.name})
            break;
        case EErrors.INVALID_TYPES_ERROR:
            res.status(400).send({status: "error", error: error.name})
            break;
        case EErrors.DATABASE_ERROR:
            res.send({status: "error", error: error.name})
            break;
        case EErrors.CAST_ERROR:
            res.send({status: "error", error: error.name})
            break;
        default:
            break;
    }
}