import TextInput from './FormComponent/TextInput';
import ImageFile from './FormComponent/ImageFile';
import CheckBox from './FormComponent/CheckBox';

const AnimeForm = (props) => {
    /* Get object useRef from props */
    const { objectRef } = props;
    const { title_jp, title_en, title_th, image, is_watching } = objectRef;
    
    return (
        <>
            <TextInput title="ชื่อเรื่องภาษาญี่ปุ่น" id="title_jp" name="title_jp" ref={title_jp} />
            <TextInput title="ชื่อเรื่องภาษาอังกฤษ" id="title_en" name="title_en" ref={title_en} />
            <TextInput title="ชื่อเรื่องภาษาไทย" id="title_th" name="title_th" ref={title_th} />
            <ImageFile title="รูปภาพอนิเมะ" id="anime_image" name="image" ref={image} />
            <CheckBox title="กำลังดูเรื่องนี้" id="is_watching" name="is_watching" ref={is_watching} />
        </>
    );
}

export default AnimeForm;