import db from '../../../db';
import Blob from 'node-blob';

const handler = async (req, res) => {

    if (req.method === 'POST') {
        try {
            const { anime, season, waifu } = req.body;
            const dateNow = new Date();
            anime.created_at = dateNow;
            anime.last_update =  dateNow;
            anime.image = base64ToBlob(anime.image).buffer;

            const arrayAnimeId = await db
            .insert(anime)
            .into('anime'); // Insert anime into database

            const animeId = arrayAnimeId[0]; // Get the id of the anime

            if(season.length !== 0) {
                const seasonHaveId = season.map((ss) => {
                    ss.anime_id = animeId;
                    return ss;
                });

                await db
                .insert(seasonHaveId)
                .into('season'); // Insert season into database
            }

            if(waifu && Object.keys(waifu).length !== 0) {
                waifu.anime_id = animeId;
                waifu.image = base64ToBlob(waifu.image).buffer;

                await db
                .insert(waifu)
                .into('waifu'); // Insert waifu into database
            }

            res.status(200).json({
                success: true,
                message: 'Anime added successfully',
                animeId
            });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: err })
        }
    }
    else if (req.method === 'GET') {
        res.status(200).json({ "message": "Can't direct in this URL!!" })
    }
}

/* Part Function */
function atob(input) {
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    var output = ''
    var chr1, chr2, chr3
    var enc1, enc2, enc3, enc4
    var i = 0
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')
    do {
        enc1 = keyStr.indexOf(input.charAt(i++))
        enc2 = keyStr.indexOf(input.charAt(i++))
        enc3 = keyStr.indexOf(input.charAt(i++))
        enc4 = keyStr.indexOf(input.charAt(i++))
        chr1 = (enc1 << 2) | (enc2 >> 4)
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
        chr3 = ((enc3 & 3) << 6) | enc4
        output = output + String.fromCharCode(chr1)
        if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2)
        }
        if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3)
        }
    } while (i < input.length)
    return output
}

const base64ToBlob = (base64, type='') => {
    const sliceSize = 1024;
    const byteCharacters = atob(base64);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        const begin = sliceIndex * sliceSize;
        const end = Math.min(begin + sliceSize, bytesLength);

        const bytes = new Array(end - begin);
        for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: type });
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb' // Set desired value here
        }
    }
}

export default handler;