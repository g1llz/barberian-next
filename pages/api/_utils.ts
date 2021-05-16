import { v4 as uuidv4 } from 'uuid'

interface IService {
  uuid: string
  name: string
  description: string | null
  price: number
  tax: number
}

interface IOrderPayload {
  userId: string | string[]
  body: {
    service: Partial<IService>
    commentary: string | null
  }
}

interface IServicePayload {
  userId: string | string[]
  body: IService
}

export function mountOrderPayload(data: IOrderPayload) {
  const {
    userId,
    body: { service, commentary }
  } = data

  return {
    userId: userId,
    uuid: uuidv4(),
    service: {
      uuid: service.uuid,
      name: service.name,
      price: service.price,
      tax: service.tax,
      amount: (service.price * service.tax) / 100
    },
    commentary,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

export function mountServicePayload(data: IServicePayload) {
  const { userId, body } = data

  return {
    userId: userId,
    uuid: uuidv4(),
    name: body.name,
    description: body.description,
    price: body.price,
    tax: body.tax,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}
