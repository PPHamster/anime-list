import db from '../../../../db';

const handler = async (req, res) => {

    if(req.method === 'GET') {
        return res.status(400).json({ message: "Can't direct into the api." });
    }

    const { query } = req;
    const { waifuId, type } = query;
    const { name_eng, name_th, level, description, image: base64, anime_id } = req.body;
    const image = !!base64 ? base64ToBlob(base64).buffer : null;

    if(type === 'update') {
        try {
            if(!!image) {
                await db('waifu')
                    .where('id', '=', +waifuId)
                    .update({ name_eng, name_th, level, description, image });
            }
            else {
                await db('waifu')
                    .where('id', '=', +waifuId)
                    .update({ name_eng, name_th, level, description });
            }

            await db('anime')
                .where('id', '=', +anime_id)
                .update({ last_update: new Date() });
            return res.status(200).json({ message: 'Successfully updated waifu.' });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: 'Failed to update waifu.' });
        }
    }
    else if(type === 'delete') {
        try {
            await db('waifu')
                .where('id', '=', +waifuId)
                .delete();

            await db('anime')
                .where('id', '=', +anime_id)
                .update({ last_update: new Date() });
            return res.status(200).json({ message: 'Successfully deleted waifu.' });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: 'Failed to delete waifu.' });
        }
    }
    
    return res.status(400).json({ message: 'Type is not supported.' });
}

export default handler;