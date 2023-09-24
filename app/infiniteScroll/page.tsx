'use client'

import { useRef, useState } from 'react'
import { InfiniteScrollList } from './components/InfiniteScrollList'
import { InfiniteScrollListItem } from './components/InfiniteScrollListItem'

const InfiniteScrollPage = () => {
  const pageCursor = useRef<string>('a')
  const hasMore = useRef(true)
  const [entries, setEntries] = useState<any[]>([])

  const fetchData = async () => {
    // NextJSを使う場合、 dev環境では reactStrictMode を false　にしないと 二回レンダリングが走るので注意
    console.log('fetch start cursor:', pageCursor.current)
    const res = await fetch(`/api/entries?cursor=${pageCursor.current}`)
      .then((res) => res.json())
      .then(({ data }) => data)

    if (res.length === 0) {
      hasMore.current = false
      return
    }

    pageCursor.current = res[res.length - 1].id
    setEntries((entries) => entries.concat(res))
  }

  return (
    <div>
      <p className="text-2xl font-bold p-4">infiniteScroll</p>
      <InfiniteScrollList pageStart={pageCursor.current} loadMore={fetchData} useWindow hasMore={hasMore.current}>
        {/* アイテムがゼロの場合の要素の高さを、少なくとも window.innerHeight お以上にしておかないと、fetchがt暴発するので注意 */}
        <div className="grid w-full grid-cols-1 gap-[12px] p-[12px] min-h-[900px]">
          {entries.map((entry, idx) => (
            <InfiniteScrollListItem key={idx} entry={entry} />
          ))}
        </div>
      </InfiniteScrollList>
    </div>
  )
}

export default InfiniteScrollPage
