import { NextRequest, NextResponse } from 'next/server'

const db = [
  { id: 1, name: 'tanaka', age: 20 },
  { id: 2, name: 'suzuki', age: 30 },
  { id: 3, name: 'sato', age: 40 },
  { id: 4, name: 'takahashi', age: 50 },
  { id: 5, name: 'watanabe', age: 60 },
  { id: 6, name: 'ito', age: 70 },
  { id: 7, name: 'yamamoto', age: 80 },
  { id: 8, name: 'nakamura', age: 90 },
  { id: 9, name: 'kobayashi', age: 10 },
  { id: 10, name: 'tomita', age: 10 },
  { id: 11, name: 'tanaka', age: 20 },
  { id: 12, name: 'suzuki', age: 30 },
  { id: 13, name: 'sato', age: 40 },
  { id: 14, name: 'takahashi', age: 50 },
  { id: 15, name: 'watanabe', age: 60 },
  { id: 16, name: 'ito', age: 70 },
  { id: 17, name: 'yamamoto', age: 80 },
  { id: 18, name: 'nakamura', age: 90 },
  { id: 19, name: 'kobayashi', age: 10 },
  { id: 20, name: 'tomita', age: 10 },
]

export const GET = async (req: NextRequest) => {
  // ここでカーソルを取得
  const searchParams = new URL(req.url).searchParams
  const cursor = searchParams.get('cursor')

  // ここで一回の re-fetch でとってくる個数を指定
  const take = 10

  try {
    /**
     * ここで cursor と take を使って、送られてきた cursor 以降のデータを取得する
     *
     * SELECT * FROM "Entry"
     * ...
     * WHERE cursorField < ${cursor}
     * ORDER BY cursorField DESC
     * LIMIT ${take}
     */

    const data = db.filter((entry) => entry.id > (isNaN(Number(cursor)) ? -1 : Number(cursor))).slice(0, take)

    return NextResponse.json({ data })
  } catch (error) {
    console.error(error)
    return new Response(null, { status: 500 })
  }
}
