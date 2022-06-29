import db from '../../../../db';
import Blob from 'node-blob';

const handler = async (req, res) => {

    if (req.method === 'GET') {
        return res.status(400).json({ message: "Can't direct into the api." });
    }

    const { name_eng, name_th, description, level, image: base64, anime_id } = req.body;
    const image = base64ToBlob(base64).buffer;

    try {
        await db
            .insert({ name_eng, name_th, description, level, image, anime_id })
            .into('waifu');

        await db('anime')
            .where('id', '=', +anime_id)    
            .update({ last_update: new Date() });
        return res.status(200).json({ message: 'Successfully created new waifu.' });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Failed to create new waifu.' });
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