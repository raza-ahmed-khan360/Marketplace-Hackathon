import { NextApiRequest, NextApiResponse } from 'next';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { isAuthenticated } = getKindeServerSession(req, res);
  const isUserAuthenticated = await isAuthenticated();

  if (isUserAuthenticated) {
    res.status(200).json({ message: 'User is authenticated' });
  } else {
    res.status(401).json({ message: 'User is not authenticated' });
  }
}
