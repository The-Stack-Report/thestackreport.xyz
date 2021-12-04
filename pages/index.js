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
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true}></link>
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100;0,300;0,500;0,700;1,100;1,300;1,500;1,700&display=swap" rel="stylesheet"></link>
        
        <link rel="icon" href="/favicon.ico" />
        
      </Head>
      <MainMenu />
      <main>
        <SilentVideo src="stack-report-announcement.mp4" />
      </main>
    </div>
  )
}

/**
 * 


      <main className={styles.main}>
        <MainMenu />
        <h1 className={styles.title}>
          The Stack Report
        </h1>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://dialectic.design"
          target="_blank"
          rel="noopener noreferrer"
        >
          The Stack Report
        </a>
      </footer>



*/
