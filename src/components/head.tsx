import NextHead from 'next/head'

function Head() {
    return (
        <NextHead>
            <meta charSet="utf-8" />
            <title>KEYHOLE</title>
            <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
            <link rel="icon" href="favicon.ico" type="image/x-icon" />

            {/*  twitter meta tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@engelsjk" />
            <meta name="twitter:creator" content="@engelsjk" />

            {/* opengraph meta tags */}
            <meta property="og:url" content="https://engelsjk.com/maps/keyhole/" />
            <meta property="og:title" content="KEYHOLE" />
            <meta property="og:description" content="ground swath coverage of declassified spy satellite imagery" />
            <meta property="og:image" content="https://engelsjk.com/maps/keyhole/shared.png" />
        </NextHead>
    )
}

export default Head;
