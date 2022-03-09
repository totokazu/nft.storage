import { useEffect, useState } from 'react'
import { TrustedBy } from '../components/trustedByLogos'
import fs from 'fs'
import decorateAdditionalCalculatedValues from '../lib/statsUtils'
import { API } from '../lib/api'
import bytes from 'bytes'
import { abbreviateNumber } from 'js-abbreviation-number'

/**
 *
 * @returns {{ props: import('../components/types.js').LayoutProps}}
 */
export function getStaticProps() {
  const logos = fs
    .readdirSync('public/images/marketplace-logos', { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name)
  logos.push('stats/calaxy.svg', 'stats/K21.svg')
  // make opensea be the first logo
  logos.sort((a, b) =>
    a.includes('opensea') ? -1 : b.includes('opensea') ? 1 : 0
  )
  return {
    props: {
      title: 'Stats - NFT Storage',
      description: 'NFT.Storage usage stats',
      navBgColor: 'bg-nsgreen',
      needsUser: false,
      logos,
    },
  }
}

/**
 * Stats Page
 * @param {Object} props
 * @param {string[]} props.logos
 *
 */
export default function Stats({ logos }) {
  /** @type [any, any] */
  const [stats, setStats] = useState({})

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const stats = await fetch(`${API}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json())
      setStats(decorateAdditionalCalculatedValues(stats))
    } catch (e) {
      const fakeData = {
        ok: true,
        data: {
          deals_size_total: 249523372029443,
          uploads_past_7_total: 2011366,
          uploads_nft_total: 685866,
          uploads_remote_total: 11077834,
          deals_total: 34959,
          uploads_car_total: 17711308,
          uploads_multipart_total: 1456388,
          uploads_blob_total: 12420729,
        },
      }
      setStats(decorateAdditionalCalculatedValues(fakeData.data))
    }
  }

  const Marquee = () => {
    return (
      <div className="marquee">
        <div className="marquee-track">
          <p className="marquee-text chicagoflf">
            Nft.Storage is storing... Nft.Storage is storing... Nft.Storage is
            storing... Nft.Storage is storing... Nft.Storage is storing...
          </p>
        </div>
      </div>
    )
  }

  /**
   * @param {Object} props
   * @param {string} [props.title]
   * @param {any} [props.children]
   */
  const StatCard = ({ title, children }) => {
    return (
      <div className="stat-card">
        <h2 className="stat-card-header chicagoflf">{title}</h2>
        <div className="stat-card-inner">{children}</div>
      </div>
    )
  }

  const StatCards = () => {
    return (
      <div className="stat-cards-wrapper">
        <div className="mw9 center pv3 ph3 ph5-ns">
          <div className="stat-cards">
            <StatCard title="Upload Count">
              <div>
                <img
                  src={'/images/stats-upload-count.svg'}
                  alt="Upload Count"
                />
                <div className="pv3 ph3">
                  <p className="chicagoflf">Total uploads to NFT.Storage</p>
                  <figure className="chicagoflf">
                    {abbreviateNumber(stats.totalUploads || 0, 1)}
                  </figure>
                  <p
                    className={`chicagoflf ${
                      stats.growthRate > 0
                        ? 'stat-green stat-green-plus'
                        : 'stat-red'
                    }`}
                  >
                    {stats.growthRate || 0}%
                  </p>
                  <p>[week over week change]</p>
                </div>
              </div>
            </StatCard>

            <StatCard title="Data Stored">
              <div>
                <img src={'/images/stats-upload-count.svg'} alt="Data Stored" />
                <div className="pv3 ph3">
                  <p className="chicagoflf">
                    Total data stored on Filecoin from NFT.Storage
                  </p>
                  <figure className="chicagoflf">
                    {bytes(stats.deals_size_total || 0)}
                  </figure>
                  <p
                    className={`chicagoflf ${
                      stats.deals_total > 0 ? 'stat-green' : 'stat-red'
                    }`}
                  >
                    {stats.deals_total || 0}
                  </p>
                  <p>[Total Deals]</p>
                </div>
              </div>
            </StatCard>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="bg-nsgreen">
      <Marquee />
      <StatCards />
      <div className="bg-nsblue">
        <div className="stats-trusted-wrapper mw9 center pv3 ph3 ph5-ns">
          <div>
            <TrustedBy logos={logos} />
          </div>
        </div>
      </div>
    </main>
  )
}