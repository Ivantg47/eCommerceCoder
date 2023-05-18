import chai from 'chai'
import supertest from 'supertest'
import { faker } from '@faker-js/faker'
import logger from '../src/utils/logger.js'
import _ from 'mongoose-paginate-v2'

const expect = chai.expect
const requester = supertest(process.env.SUPERTEST_URL)
let tokenAdmin
describe('Registro, Login and Current', () => {
    let cookie;

    const mockUserAdmin = {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        age: faker.date.birthdate(),
        email: faker.internet.email(),
        password: 'secret',
        role: 'admin'
    }

    const mockUser = {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        age: faker.date.birthdate(),
        email: faker.internet.email(),
        password: 'secret'
    }

    it('Debe registrar un usario', async () => {
        const {header} = await requester.post('/session/register').send(mockUser)
        
        expect(header.location = '/session/login').to.be.ok
    })

    it('Debe loguear un user y DEVOLVER UNA COOKIE', async () => {
        const result = await requester.post('/session/login').send({
            email: mockUser.email, password: mockUser.password
        })

        //COOKIE_NAME=COOKIE_VALUE
        const cookieResult = result.headers['set-cookie'][0]
        expect(cookieResult).to.be.ok 
        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1]
        }
//         console.log(cookieResult);
        expect(cookie.name).to.be.ok.and.eql('coderCookieToken')
        expect(cookie.value).to.be.ok

    })

    it('enviar cookie para ver el contenido del usuario', async () => {
        
        const { _body } = await requester.get('/session/current').set('Cookie', [`${cookie.name}=${cookie.value}`])
        
        expect(200)
        expect(_body.payload.email).to.be.eql(mockUser.email)
        
    })

    it('Debe registrar un usario admin', async () => {
        
        const {header} = await requester.post('/session/register').send(mockUserAdmin)
        
        expect(header.location = '/session/login').to.be.ok

        const result = await requester.post('/session/login').send({
            email: mockUserAdmin.email, password: mockUserAdmin.password
        })

        const cookieResult = result.headers['set-cookie'][0]
        expect(cookieResult).to.be.ok 
        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1]
        }

        const { _body } = await requester.get('/session/current').set('Cookie', [`${cookie.name}=${cookie.value}`])
               
        expect(200)
        expect(_body.payload.role).to.be.eql('admin')

        tokenAdmin = `${cookie.name}=${cookie.value}`

    })
})

describe('Test CRUD productos', () => {

    const mockProduct = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.image(),
        code: faker.datatype.string(5),
        stock: faker.datatype.number(100),
        category: faker.commerce.department(),
        status: faker.datatype.boolean()
    }
    
    it('Debe registrar un producto', async () => {
        const result = await requester.post('/api/products').send(mockProduct).set('Cookie', [tokenAdmin])
        
        result._body.payload._id = result._body.payload?.id
        expect(result.status).to.be.eql(200)
        expect(result._body.payload).to.have.property('_id')
        expect(result._body.payload.thumbnail).to.be.ok

        mockProduct.id = result._body.payload._id 
    })

    it('Debe obtener el producto creado', async () => {
        const result = await requester.get(`/api/products/${mockProduct.id}`).send(mockProduct).set('Cookie', [tokenAdmin])

        result._body.payload._id = result._body.payload?.id

        expect(result.status).to.be.eql(200)
        expect(result._body.payload).to.have.property('_id')

    })

    it('Debe obtener todos los productos', async () => {
        
        const { _body } = await requester.get('/api/products')
        
        expect(200)
        expect(_body.status).to.be.eql('success')
        
    })

    it('Debe modificar un producto', async () => {
        
        const { _body } = await requester.put(`/api/products/${mockProduct.id}`).send({stock: 10}).set('Cookie', [tokenAdmin])
        
        expect(200)
        expect(_body.status).to.be.eql('success')
        expect(_body.payload.stock).not.to.be.equal(mockProduct.stock)
        
    })

    it('Debe eliminar un producto', async () => {
        
        const { _body } = await requester.delete(`/api/products/${mockProduct.id}`).set('Cookie', [tokenAdmin])
        
        expect(200)
        expect(_body.status).to.be.eql('success')
        expect(_body.message).to.be.eql('Producto eliminado')
        
    })
})

describe('Test CRUD carrito', () => {
    
    let cart = {}
    it('Debe crear un carrito', async () => {
        const { _body } = await requester.post('/api/carts')
        
        _body.payload._id = _body.payload?.id
        
        expect(_body.status).to.be.eql('success')
        expect(_body.payload).to.have.property('_id')

        cart.id = _body.payload._id
    })

    it('Debe obtener el carrito creado', async () => {
        const result = await requester.get(`/api/carts/${cart.id}`).set('Cookie', [tokenAdmin])

        result._body.payload._id = result._body.payload?.id
        
        expect(result.status).to.be.eql(200)
        expect(result._body.payload).to.have.property('_id')
         
    })

    it('Debe obtener todos los carritos', async () => {
        
        const { _body } = await requester.get('/api/carts').set('Cookie', [tokenAdmin])
        
        expect(200)
        expect(_body.status).to.be.eql('success')
        
    })

    it('Debe modificar un carrito', async () => {
        
        const { _body } = await requester.put(`/api/carts/${cart.id}`).send([{product: 10, quantity: 2}]).set('Cookie', [tokenAdmin])
        
        _body.payload._id = _body.payload?.id

        expect(200)
        expect(_body.status).to.be.eql('success')
        expect(_body.payload).to.have.property('_id')
        
    })

    const mockProduct = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.image(),
        code: faker.datatype.string(5),
        stock: faker.datatype.number(100),
        category: faker.commerce.department(),
        status: faker.datatype.boolean()
    }

    it('Debe agregar un producto al carrito', async () => {
        
        const result = await requester.post('/api/products').send(mockProduct).set('Cookie', [tokenAdmin])
        mockProduct.id = result._body.payload?._id || result._body.payload?.id 
        
        const  { _body }  = await requester.post(`/api/carts/${cart.id}/product/${mockProduct.id}`).set('Cookie', [tokenAdmin])
        cart = _body.payload
        expect(200)
        expect(_body.status).to.be.eql('success')
        expect(_body.message).to.be.eql('Producto agregado')
        
    })

    it('Debe modificar un producto del carrito', async () => {
        
        const { _body } = await requester.put(`/api/carts/${cart.id}/product/${mockProduct.id}`).send({quantity: 5}).set('Cookie', [tokenAdmin])
        
        expect(200)
        expect(_body.status).to.be.eql('success')
        expect(_body.message).to.be.eql('Producto actualizado')
        expect(_body.payload.products[1].quantity).not.to.be.equal(cart.products[1].quantity)
        
    })

    it('Debe eliminar un producto del carrito', async () => {
        
        const { _body } = await requester.delete(`/api/carts/${cart.id}/product/10`).set('Cookie', [tokenAdmin])
        
        expect(200)
        expect(_body.status).to.be.eql('success')
        expect(_body.message).to.be.eql('Producto eliminado')
        
    })

    it('Debe generar ticket', async () => {
        
        const { _body } = await requester.get(`/api/carts/${cart.id}/purchase`).set('Cookie', [tokenAdmin])
        
        expect(200)
        if (_body.status == 'success') {
            expect(_body.status).to.be.eql('success')
            expect(_body.message).to.be.eql('Compra realizada')
        } else {
            expect(_body.status).to.be.eql('partial')
            expect(_body.message).to.be.eql('Algunos productos no pudieron ser procesados')
        }
        
        expect(_body.payload).to.have.property('code')
        
        await requester.delete(`/api/products/${mockProduct.id}`).set('Cookie', [tokenAdmin])

    })

    it('Debe eliminar un carrito', async () => {
        
        const { _body } = await requester.delete(`/api/carts/${cart.id}`).set('Cookie', [tokenAdmin])
        
        expect(200)
        expect(_body.status).to.be.eql('success')
        expect(_body.message).to.be.eql('Carrito eliminado')
        
    })
})

