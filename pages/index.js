import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Center from '../components/Center'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='flex'>
        <Sidebar />
        <Center />
      </main>

      
    </div>
  )
}
//Pre rendering the props and user info
//It will give us the access token before the client  

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return{
    props: {
      session
    }
  }
}