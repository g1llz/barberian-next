import { NextApiRequest, NextApiResponse } from 'next'
import { mongo } from '../../../database/connection'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const userId = req.headers['x-userid']
  const {
    query: { uuid },
    body,
    method
  } = req

  if (!userId) return res.status(401).send({})
  if (!uuid)
    return res
      .status(422)
      .json({ sucess: false, message: `Service uuid is required` })

  const db = await mongo()
  switch (method) {
    case 'DELETE':
      const deleted = await db
        .collection('services')
        .deleteOne({ uuid: uuid, userId: userId })

      if (!deleted.deletedCount)
        return res
          .status(404)
          .json({ success: false, message: `Service ${uuid} not found` })

      return res
        .status(200)
        .json({ suscces: true, message: `Service ${uuid} has been deleted` })

    case 'PUT':
      const updated = await db
        .collection('services')
        .updateOne(
          { uuid: uuid },
          { $set: { ...req.body, updatedAt: new Date().toISOString() } }
        )

      if (!updated.modifiedCount)
        return res
          .status(404)
          .json({ success: false, message: `Service ${uuid} not found` })

      const doc = await db.collection('services').findOne({ uuid: uuid })
      return res.status(200).json({ success: true, data: doc })
    default:
      res.setHeader('Allow', ['DELETE', 'PUT'])
      res.status(405).json({ sucess: false, message: `Method ${method} Not Allowed` })
  }
}
