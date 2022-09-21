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
            <meta property="twitter:image" content="https://keyhole.engelsjk.com/splash.png" />

            {/* opengraph meta tags */}
            <meta property="og:url" content="https://keyhole.engelsjk.com/" />
            <meta property="og:title" content="KEYHOLE" />
            <meta property="og:description" content="An experimental visualization of ground swaths from declassified spy satellite imagery." />
            <meta property="og:image" content="https://keyhole.engelsjk.com/splash.png" />
        </NextHead>
    )
}

export default Head;
