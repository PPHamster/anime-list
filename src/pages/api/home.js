import db from '../../db';

const handler = async (req, res) => {
    const { userId } = req.body;

    let allAnime = [];

    try {
        if (req.method === 'GET') {
            return res.status(400).json({ message: "Can't direct into this API" });
        }
        
        allAnime = await db
            .select('a.id', 'a.title_jp', 'a.title_en', 'a.title_th', 'a.created_at',
                'a.last_update', 'a.is_watching')
            .count('s.anime_id AS season_count')
            .sum('s.chapter_count AS all_chapter')
            .from('anime AS a')
            .leftJoin('season AS s', 'a.id', 's.anime_id')
            .where('a.user_id', '=', userId)
            .groupBy('a.id')
            .orderBy('a.id', 'asc');
        return res.status(200).json(allAnime);

    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error', error: error.code })
    }
}

export default handler;