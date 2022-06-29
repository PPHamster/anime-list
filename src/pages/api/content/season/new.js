import db from '../../../../db';

const handler = async (req, res) => {

    if (req.method === 'GET') {
        return res.status(400).json({ message: "Can't direct into the api." });
    }

    const { title, sequence, chapter_count, anime_id } = req.body;

    try {
        await db
            .insert({ title, sequence, chapter_count, anime_id })
            .into('season');

        await db('anime')
            .where('id', '=', +anime_id)
            .update({ last_update: new Date() });
        return res.status(200).json({ message: 'Successfully created new season.' });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Failed to create new season.' });
    }
}

export default handler;