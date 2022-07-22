import db from '../../db';

const handler = async (req, res) => {
    const { id, name, email, image } = req.body;

    try {
        if (req.method === 'GET') {
            return res.status(400).json({ message: "Can't direct into this API" });
        }

        const users = await db
            .select('*')
            .from('users')
            .where('id', '=', id);

        if (users.length === 0) {
            await db
                .insert({ id, name, email, image })
                .into('users');
            return res.status(200).json({ message: 'Add new user successfully' });
        }

        const user = users[0];
        if (user.name !== name || user.image !== image) {
            await db('users')
                .where('id', '=', id)
                .update({ name, image });
            return res.status(200).json({ message: 'Login and update successfully' });
        }

        return res.status(200).json({ message: 'Login successfully' });

    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error', error: error.code })
    }
}

export default handler;