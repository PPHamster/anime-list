import db  from '../../../db';

const handler = async (req, res) => {
    const { query } = req;
    const { animeId, target } = query;
    let images = null;

    try {
        if (!!target && target === 'anime') {
            images = await db
                .select('image AS animeImage')
                .from('anime')
                .where('id', '=', +animeId);
            const { animeImage } = images[0];
            res.status(200).json({ animeImage });
        }
        else if (!!target && target === 'waifu') {
            images = await db
                .select('image AS waifuImage')
                .from('waifu')
                .where('anime_id', '=', +animeId);
            const { waifuImage } = images[0];
            res.status(200).json({ waifuImage });
        }
        else {
            images = await db
                .select('anime.image AS animeImage', 'waifu.image AS waifuImage')
                .from('anime')
                .leftJoin('waifu', 'anime.id', 'waifu.anime_id')
                .where('anime.id', '=', +animeId);
            const { animeImage, waifuImage = {} } = images[0];
            res.status(200).json({ animeImage, waifuImage });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ images })
    }
}

export default handler;