import { NextApiRequest, NextApiResponse } from 'next'
import { mongo } from '../../database/connection'
import { mountOrderPayload } from './_utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const userId = req.headers['x-userid']
  const { method, body } = req

  if (!userId) return res.status(401).send({})

  const db = await mongo()
  switch (method) {
    case 'GET':
      const items = await db
        .collection('orders')
        .find({ userId: userId })
        .toArray()
      return res.status(200).json({ success: true, data: items.reverse() })

    case 'POST':
      const payload = mountOrderPayload({ body, userId })

      const { insertedId } = await db.collection('orders').insertOne(payload)
      const doc = await db.collection('orders').findOne({ _id: insertedId })

      return res.status(201).json({ success: true, data: doc })
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).json({ sucess: false, message: `Method ${method} Not Allowed` })
  }
}
