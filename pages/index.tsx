import { AnimatePresence, motion } from 'framer-motion'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import DropDown, { VibeType } from '../components/DropDown'
import Footer from '../components/Footer'
// import Header from "../components/Header";
import Github from '../components/GitHub'
import LoadingDots from '../components/LoadingDots'
import ResizablePanel from '../components/ResizablePanel'

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false)
  const [desc, setDesc] = useState('')
  const [lang, setLang] = useState<VibeType>('English')
  const [generatedDescs, setGeneratedDescs] = useState<string>('')
  const defultDesc =
    'Tell David to have a meeting next Monday morning from Hudson.'
  console.log('Streamed response: ', { generatedDescs })
  let promptObj = {
    English: 'UK English',
    中文: 'Simplified Chinese',
    繁體中文: 'Traditional Chinese',
    日本語: 'Japanese',
    Italiano: 'Italian',
    Deutsch: 'German',
    Español: 'Spanish',
    Français: 'French',
    Nederlands: 'Dutch',
    한국어: 'Korean',
    ភាសាខ្មែរ: 'Khmer',
    हिंदी: 'Hindi',
  }
  let text = desc || defultDesc
  // Generate a business email in UK English that is friendly, but still professional and appropriate for the workplace. The email topic is:
  const prompt = `Generate a business email in ${
    promptObj[lang]
  } that is friendly, but still professional and appropriate for the workplace. The email topic is:${text}${
    text.slice(-1) === '.' ? '' : '.'
  }`

  const generateDesc = async (e: any) => {
    e.preventDefault()
    setGeneratedDescs('')
    setLoading(true)
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    })
    console.log('Edge function returned.')

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    // This data is a ReadableStream
    const data = response.body
    if (!data) {
      return
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)
      setGeneratedDescs((prev) => prev + chunkValue)
    }

    setLoading(false)
  }

  return (
    <div className='flex flex-col items-center justify-center max-w-5xl min-h-screen py-2 mx-auto'>
      <Head>
        <title>Email Generator</title>
        <link
          rel='icon'
          href='/favicon.ico'
        />
      </Head>

      <main className='flex flex-col items-center justify-center flex-1 w-full px-4 mt-2 text-center sm:mt-4'>
        <div className='flex flex-wrap justify-center space-x-5'>
          {/* <a
            className='flex items-center justify-center px-4 py-2 mb-5 space-x-2 text-sm text-gray-600 transition-colors bg-white border border-gray-300 rounded-full shadow-md max-w-fit hover:bg-gray-100'
            href='https://twitter.com/shengxj1/status/1619207448547692547'
            target='_blank'
            rel='noopener noreferrer'
          >
            <svg
              aria-hidden='true'
              className='w-6 h-6 fill-slate-500 group-hover:fill-slate-700'
            >
              <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 22 5.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 2.8 9.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.093 4.093 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 2 18.407a11.615 11.615 0 0 0 6.29 1.84' />
            </svg>
            <p>Introduction</p>
          </a> */}

          <a
            className='flex items-center justify-center px-4 py-2 mb-5 space-x-2 text-sm text-gray-600 transition-colors bg-white border border-gray-300 rounded-full shadow-md max-w-fit hover:bg-gray-100'
            href='https://github.com/quanscheng/open-ai-email-helper'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Github />
            <p>Star on GitHub</p>
          </a>
        </div>

        <h1 className='text-2xl font-bold sm:text-3xl max-w-1xl text-slate-900'>
          Generate your business emails in seconds
        </h1>
        {/* <p className="mt-5 text-slate-500">18,167 bios generated so far.</p> */}
        <div className='w-full max-w-xl'>
          <div className='flex items-center mt-4 mb-3 space-x-3'>
            <Image
              src='/1-black.png'
              width={30}
              height={30}
              alt='1 icon'
            />
            <p className='font-medium text-left'>
              Write a few sentences about your desired email.
            </p>
          </div>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            className='w-full my-2 border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black'
            placeholder={'e.g. ' + defultDesc}
          />
          <div className='flex items-center mb-5 space-x-3'>
            <Image
              src='/2-black.png'
              width={30}
              height={30}
              alt='1 icon'
            />
            <p className='font-medium text-left'>Select your language.</p>
          </div>
          <div className='block'>
            <DropDown
              vibe={lang}
              setVibe={(newLang) => setLang(newLang)}
            />
          </div>

          {!loading && (
            <button
              className='w-full px-4 py-2 mt-3 font-medium text-white bg-black rounded-xl sm:mt-4 hover:bg-black/80'
              onClick={(e) => generateDesc(e)}
            >
              Generate your email &rarr;
            </button>
          )}
          {loading && (
            <button
              className='w-full px-4 py-2 mt-3 font-medium text-white bg-black rounded-xl sm:mt-4 hover:bg-black/80'
              disabled
            >
              <LoadingDots
                color='white'
                style='large'
              />
            </button>
          )}
        </div>
        <Toaster
          position='top-center'
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className='h-px bg-gray-700 border-1 dark:bg-gray-700' />
        <ResizablePanel>
          <AnimatePresence mode='wait'>
            <motion.div className='my-4 space-y-10'>
              {generatedDescs && (
                <>
                  <div>
                    <h2 className='mx-auto text-3xl font-bold sm:text-4xl text-slate-900'>
                      Your generated email
                    </h2>
                  </div>
                  <div className='flex flex-col items-center justify-center max-w-xl mx-auto space-y-8 whitespace-pre-wrap'>
                    <div
                      className='p-4 text-left transition bg-white border shadow-md rounded-xl hover:bg-gray-100 cursor-copy'
                      onClick={() => {
                        navigator.clipboard.writeText(generatedDescs)
                        toast('Email copied to clipboard', {
                          icon: '✂️',
                        })
                      }}
                    >
                      <p>{generatedDescs}</p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  )
}

export default Home
