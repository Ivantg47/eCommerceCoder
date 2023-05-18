export const generateProductErrorInfo = product => {
    return `Uno o mas propiedades estan incompletos o son invalidos.
    Lista de propiedades obligatorios:
        * title: Necesita ser un string, recibio ${product.title}
        * description: Necesita ser un string, recibio ${product.description}
        * price: Necesita ser un numeric, recibio ${product.price}
        * thumbnail: Necesita ser un string, recibio ${product.thumbnail}
        * code: Necesita ser un string, recibio ${product.code}
        * stock: Necesita ser un numeric, recibio ${product.stock}
        * category: Necesita ser un string, recibio ${product.category}
        * status: Necesita ser un boolean, recibio ${product.status}
    `
}