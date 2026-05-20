const { MongoClient } = require('mongodb');

let cachedClient = null;

async function getClient() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const client = await getClient();
    const collection = client.db('SaRoleMap').collection('mapState');

    if (req.method === 'GET') {
      const doc = await collection.findOne({ _id: 'main' });
      if (!doc) return res.status(404).json({ error: 'No saved state' });
      const { _id, ...data } = doc;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { state, positions } = req.body || {};
      if (!state || !positions) return res.status(400).json({ error: 'Invalid data' });
      await collection.replaceOne(
        { _id: 'main' },
        { _id: 'main', state, positions, updatedAt: new Date() },
        { upsert: true }
      );
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    // If client is broken, reset so next request retries
    cachedClient = null;
    return res.status(500).json({ error: 'Server error', detail: err.message });
  }
};
