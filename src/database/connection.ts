import { MongoClient } from 'mongodb'

let client = null

export async function mongo() {
  const uri = process.env.MONGO_CONNECTION_URL

  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  
    await client.connect()
  }
  
  return client.db('barberian')
}