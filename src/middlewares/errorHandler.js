let errorHandler = (error,req,res,next) => {
    console.log('1: ', error.stack)
    console.log('2: ', error.name)
    res.status(500).json({
        successs: false,
        error: error.message
    })
}

export default errorHandler