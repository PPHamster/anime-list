import Head from 'next/head';

const Header = (props) => {
    return (
        <Head>
            <title>{props.title}</title>
            <link rel="icon" href="/images/PP-Anilist-Icon.png" />
            <meta name="description" content="PP-Anilist is anime memo that make you can memorize anime everywhere"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
        </Head>
    );
}

export default Header;