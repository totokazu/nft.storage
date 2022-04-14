import { useEffect } from 'react'

import countly from '../lib/countly'

/**
 * Static Props
 *
 * @returns {{ props: import('../components/types.js').LayoutProps}}
 */
export const getStaticProps = () => ({
  props: {
    title: 'Page Not Found',
    description: 'NFT.Storage 404',
    navBgColor: 'bg-nslime',
    needsUser: false,
  },
})

export default function Custom404() {
  useEffect(() => {
    countly.trackEvent(countly.events.NOT_FOUND, {
      path: location.pathname,
    })
  }, [])

  return (
    <main className="bg-nslime grow flex">
      <div
        style={{
          width: '100%',
          height: '100%',
          textAlign: 'center',
          padding: '10rem',
        }}
      >
        <img
          height="1120"
          width="1844"
          style={{
            margin: 'auto',
            width: '40vw',
            height: 'auto',
            maxHeight: '1120px',
          }}
          className="mt-8 mb-2 sm:mb-8 inline-block"
          src="/images/image-404.gif"
          alt="Page Not Found"
        />
        <h1 className="chicagoflf text-xl lg:text-4xl sm:text-5xl font-normal my-5">
          Page Not Found
        </h1>
      </div>
    </main>
  )
}
