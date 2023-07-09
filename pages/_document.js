import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com"></link>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true.toString()}></link>
                <meta httpEquiv="X-UA-Compatible" content="ie=edge" />

                <link href="https://fonts.googleapis.com/css2?family=Freehand&family=Roboto+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet"></link>

                <link rel="icon" href="/blocks-favicon.png" />
                <script type="application/ld+json"
                    dangerouslySetInnerHTML={{__html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "url": "https://thestackreport.xyz",
                        "logo": "https://thestackreport.xyz/blocks-favicon.png"
                    })}}
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument