import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')
  const date = searchParams.get('date')
  const location = searchParams.get('location')

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div style={{ marginBottom: 10 }}>{title}</div>
        <div style={{ marginBottom: 10 }}>{date}</div>
        <div>{location}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}