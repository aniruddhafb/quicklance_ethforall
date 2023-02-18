import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import heroImg from '../../public/images/hero.svg'
import Link from 'next/link'
import axios from 'axios'



const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [data, setData] = useState([]);
  const fetchFreelancers = async () => {
    const res = await axios({
      url: `${process.env.NEXT_PUBLIC_PROD_SERVER}/api/freelancers/getAllfreelancers`,
      method: "GET",
    });
    // console.log(res.data);
    setData(res.data);
  };

  useEffect(() => {
    fetchFreelancers();
  }, []);

  return (
    <>
      <Head>
        <title>Quicklance - The first decentralized platform for freelancers</title>
        <meta name="description" content="Find best web3 projects and work on them to get paid securely, find suitable crypto jobs matching your profile, connect easly with other freelancers" />
        <meta name="keywords" content="freelancing dapp, quicklance" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* hero section  */}
      <header className=" dark:bg-gray-900">

        <div className="container px-6 py-16 mx-auto">
          <div className="items-center lg:flex">
            <div className="w-full lg:w-1/2">
              <div className="lg:max-w-lg">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">Best Place To Get Started With<br />  <span className="text-blue-500 ">Freelance</span> Quickly!</h1>

                <p className="mt-3 mb-6 text-gray-600 dark:text-gray-400">Find best web3 projects and work on them to get paid securely, find suitable crypto jobs matching your profile, connect easly with other freelancers </p>

                <Link href="/create/create-profile" className="w-full px-5 py-2 mt-6 text-sm tracking-wider text-white uppercase font-bold transition-colors duration-300 transform bg-blue-600 rounded-lg lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500">Get started</Link>
                <Link href="/freelancers" className="w-full px-5 py-2 mt-6 ml-4 text-sm tracking-wider text-blue-600 font-bold uppercase transition-colors duration-300 transform bg-white rounded-lg lg:w-auto hover:bg-gray-200 focus:outline-none">Hire A Talent</Link>
              </div>
            </div>

            <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
              <Image className="w-full h-full lg:max-w-3xl" src={heroImg} height={60} width={100} alt="Catalogue-pana.svg" />
            </div>
          </div>
        </div>
      </header >

      {/* freelancers section  */}
      <div className='bg-gray-300'>
        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
          <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
            <div>
              <p className="inline-block px-3 py-px mb-2 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
                Platform Verified
              </p>
            </div>
            <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
              Top Freelancers
            </h2>
            <p className="text-base text-gray-700 md:text-lg">
              Find the best person for your web3 work from experienced and verified freelancers
            </p>
          </div>


          <div className="grid gap-10 row-gap-8 mx-auto sm:row-gap-10 lg:max-w-screen-lg sm:grid-cols-2 lg:grid-cols-3">
            {data.map((e, i) => {
              return i < 9 && (
                <Link href={`freelancers/${e.wallet}`}>
                  <div className="flex">
                    <Image src={e.image?.replace(
                      "ipfs://",
                      "https://gateway.ipfscdn.io/ipfs/"
                    )} height={100} width={100} className="object-cover w-20 h-20 mr-4 rounded-full shadow" alt="Person" />
                    <div className="flex flex-col justify-center">
                      <p className="text-lg font-bold"> {e.username}</p>
                      <p className="text-sm text-gray-800">{e.wallet.slice(0, 5) +
                        "..." +
                        e.wallet.slice(38)}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  )
}
