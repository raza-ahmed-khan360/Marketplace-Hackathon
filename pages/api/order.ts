import { NextApiRequest, NextApiResponse } from 'next';
import { client } from '@/lib/sanity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const orderData = req.body;

      // Validate order data
      if (!orderData || !orderData.items || !orderData.total || !orderData.shippingAddress) {
        return res.status(400).json({ message: 'Invalid order data' });
      }

      console.log('Received Order Data:', orderData); // Log received order data

      // Save order to Sanity
      const createdOrder = await client.create(orderData);
      console.log('Created Order in Sanity:', createdOrder); // Log created order in Sanity

      res.status(201).json(createdOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Failed to create order' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
