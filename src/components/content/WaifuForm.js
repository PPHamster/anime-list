import { useState } from 'react';
import TextArea from './FormComponent/TextArea';
import CheckBox from './FormComponent/CheckBox';
import TextInput from './FormComponent/TextInput';
import ImageFile from './FormComponent/ImageFile';
import SelectOption from './FormComponent/SelectOption';

const WaifuForm = (props) => {
    /* Set useState for show and hide waifu form */
    const [haveWaifu, setHaveWaifu] = useState(false);

    /* Get object useRef from props */
    const { objectRef } = props;
    const { have_waifu, name_eng, name_th, description, level, image } = objectRef;

    /* Option for level in waifu */
    const optionValue = [
        'ไม่ชอบเลย',
        'ไม่ค่อยชอบ',
        'เฉยๆ',
        'ชอบ',
        'ชอบมาก',
        'รักเลย'
    ];

    /* Case this anime have waifu */
    if(haveWaifu) return (
        <>
            <CheckBox title="มี Waifu จากเรื่องนี้หรือไม่" id="have_waifu" name="have_waifu" ref={have_waifu} onCheckedChange={setHaveWaifu} />
            <TextInput title="ชื่อภาษาอังกฤษ" id="name_eng" name="name_eng" ref={name_eng} />
            <TextInput title="ชื่อภาษาไทย" id="name_th" name="name_th" ref={name_th} />
            <TextArea title="เหตุผลที่ชอบ" id="description" name="description" ref={description} />
            <SelectOption title="ความอวย" id="level" name="level" optionValue={optionValue} ref={level} />
            <ImageFile title="รูปภาพ Waifu" id="waifu_image" name="image" ref={image} />
        </>
    );

    /* Case this anime not have waifu */
    return (
        <CheckBox title="มี Waifu จากเรื่องนี้หรือไม่" id="have_waifu" name="have_waifu" ref={have_waifu} onCheckedChange={setHaveWaifu} />
    );
}

export default WaifuForm;