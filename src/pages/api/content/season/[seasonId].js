import db from '../../../../db';

const handler = async (req, res) => {

    if(req.method === 'GET') {
        return res.status(400).json({ message: "Can't direct into the api." });
    }

    const { query } = req;
    const { seasonId, type } = query;
    const { title, sequence, chapter_count, anime_id } = req.body;

    if(type === 'update') {
        try {
            await db('season')
                .where('id', '=', +seasonId)
                .update({ title, sequence, chapter_count });

            await db('anime')
                .where('id', '=', +anime_id)
                .update({ last_update: new Date() });
            return res.status(200).json({ message: 'Successfully updated season.' });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: 'Failed to update season.' });
        }
    }
    else if(type === 'delete') {
        try {
            await db('season')
                .where('id', '=', +seasonId)
                .delete();

            await db('anime')
                .where('id', '=', +anime_id)
                .update({ last_update: new Date() });
            return res.status(200).json({ message: 'Successfully deleted season.' });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: 'Failed to delete season.' });
        }
    }
    
    return res.status(400).json({ message: 'Type is not supported.' });
}

export default handler;