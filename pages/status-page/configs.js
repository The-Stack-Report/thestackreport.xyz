import Head from "next/head"
import PageLayout from "components/PageLayout"

const ConfigsPage = () => {
    return (
        <PageLayout>
            <Head>
                <title>Configs</title>
            </Head>
            <h1>Configs</h1>
        </PageLayout>
    )
}


// TODO: show any unset environment variables

export default ConfigsPage