import Head from 'next/head'
import Image from 'next/image'
import MainMenu from 'components/MainMenu'
import SilentVideo from 'components/SilentVideo'
import styles from '../styles/Home.module.css'


export default function Home() {
  return (
    <div>
      <Head>
        <title>The Stack Report</title>
        <meta name="description" content="Data driven reporting and visualisations from within the Tezos ecosystem." />
        
        
      </Head>
      <MainMenu />
      <main>
        <SilentVideo src="stack-report-announcement.mp4" />
      </main>
    </div>
  )
}
