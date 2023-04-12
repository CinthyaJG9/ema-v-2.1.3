import { NextApiRequest, NextApiResponse } from 'next';
import { apiSuccess } from 'utils/success';
import { apiError } from 'utils/errors';
import { ResponseUser } from 'typings';
import { searchUserByEmailOfDB } from 'database/Entities/DUser';
type Data = { message: string } | ResponseUser;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET': {
      try {
        const { email } = req.query;

        const dataPersonas = await searchUserByEmailOfDB(email as string);
        return apiSuccess(res, dataPersonas, 'Person');
      } catch (error) {
        return apiError(res, error, 'searchByAppatAndApmat');
      }
    }
    default:
      return res.status(405).json({ message: 'Bad request' });
  }
}
