import db from '../../db';

const handler = async (req, res) => {
    try {

        const users = await db
            .select('*')
            .from('users');

        return res.status(200).json(users);

    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error', error: error.code })
    }
}

export default handler;