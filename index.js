const { request, response } = require('express')
const express = require('express')
const uuid = require('uuid')
const port = 3000
const app = express()
app.use(express.json())

const orders = []

const idStatusCheck = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "Order Not Found" })
    }

    request.orderIndex = index

    request.orderId = id

    next()
}

const requisitionMethod = (request, response, next) => {
    // console.log(`Método da requisiçao ${request.method}. URL da requisição http://localhost:3000${request.route.path}`)
    const method = request.method
    const url = request.url

    console.log(`Método da requisiçao: ${method}. URL da requisição http://localhost:3000${url}`)
    next()
}

app.post('/order', requisitionMethod, (request, response) => {
    const { order, clientName, price } = request.body

    const orderProgress = { id: uuid.v4(), order, clientName, price, status: "Em preparação" }

    orders.push(orderProgress)

    return response.status(201).json(orderProgress)
})

app.get('/order', requisitionMethod, (request, response) => {
    return response.json(orders)
})

app.put('/order/:id', requisitionMethod, idStatusCheck, (request, response) => {
    const { order, clientName, price } = request.body

    const index = request.orderIndex

    const id = request.orderId

    const orderUpdate = { id, order, clientName, price }

    orders[index] = orderUpdate


    return response.json(orderUpdate)
})

app.delete('/order/:id', requisitionMethod, idStatusCheck, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.get('/order/:id', requisitionMethod, idStatusCheck, (request, response) => {
    const index = request.orderIndex

    const order = orders[index]

    return response.json(order)
})

app.patch('/order/:id', requisitionMethod, idStatusCheck, (request, response) => {
    const index = request.orderIndex

    orders[index].status = "Pronto"

    return response.json(orders[index])
})

app.listen(port, () => {
    console.log(`🍀Server starded on port ${port}`)
})