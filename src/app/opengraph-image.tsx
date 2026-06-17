import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Biltechie — Web3 & Full-Stack Developer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Dot grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(0,255,136,0.15) 2px, transparent 2px)',
            backgroundSize: '36px 36px',
            opacity: 0.4,
            display: 'flex',
          }}
        />

        {/* Logo mark - built with divs, not SVG text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 14,
              border: '2px solid #00ff88',
              color: '#00ff88',
              fontSize: 22,
              fontWeight: 700,
              fontFamily: 'monospace',
            }}
          >
            BT
          </div>
          <div style={{ display: 'flex', fontSize: 28, fontFamily: 'monospace', color: '#00ff88', letterSpacing: 2 }}>
            AVAILABLE FOR WEB3 PROJECTS
          </div>
        </div>

        {/* Main title */}
        <div
          style={{
            display: 'flex',
            fontSize: 96,
            fontFamily: 'monospace',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          Bil<span style={{ color: '#00ff88' }}>techie</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 48,
          }}
        >
          Full-Stack Developer · Web3 Builder · NFT Systems
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 56 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 40, fontFamily: 'monospace', color: '#00ff88', fontWeight: 700 }}>3+</div>
            <div style={{ display: 'flex', fontSize: 20, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>Mainnet contracts</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 40, fontFamily: 'monospace', color: '#00ff88', fontWeight: 700 }}>24k+</div>
            <div style={{ display: 'flex', fontSize: 20, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>NFTs generated</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 40, fontFamily: 'monospace', color: '#00ff88', fontWeight: 700 }}>5+</div>
            <div style={{ display: 'flex', fontSize: 20, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>Live projects</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
