'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { useMount } from 'react-use'

type Props = {
  children: ReactNode
  pageStart: string | number
  loadMore: Function
  useWindow: boolean
  hasMore: boolean
}

// 無限スクロールの親要素の一番下から、どのくらいのところまで来たら、loadMore を呼び出すか
// ここがゼロ = 一番したまでスクロールしないと、loadMore が呼ばれない
const threshold = 100

// 参考
// https://github.com/danbovey/react-infinite-scroller/blob/master/src/InfiniteScroll.js

export const InfiniteScrollList = ({ children, pageStart, hasMore, loadMore, useWindow }: Props) => {
  const scrollComponent = useRef<HTMLDivElement>(null)
  const beforeScrollHeight = useRef(0)
  const beforeScrollTop = useRef(0)
  const _loadMore = useRef<Function | null>(null)

  const getParentElement = (el: HTMLElement): HTMLElement => {
    return el.parentNode as HTMLElement
  }

  const scrollListener = () => {
    const el = scrollComponent.current
    if (!el) return

    const scrollEl: any = window
    const parentNode = getParentElement(el)

    let offset
    if (useWindow) {
      const doc: any = document.documentElement || document.body.parentNode || document.body
      const scrollTop = scrollEl.pageYOffset !== undefined ? scrollEl.pageYOffset : doc.scrollTop
      offset = calculateOffset(el, scrollTop)
    } else {
      offset = el.scrollHeight - parentNode.scrollTop - parentNode.clientHeight
    }

    // Here we make sure the element is visible as well as checking the offset
    if (offset < threshold && el && el.offsetParent !== null) {
      console.log('ここがよばれると言うことは、スクロールの限界に近づいた', offset, threshold)
      detachScrollListener()
      beforeScrollHeight.current = parentNode.scrollHeight
      beforeScrollTop.current = parentNode.scrollTop

      if (typeof _loadMore.current === 'function') {
        _loadMore.current(pageStart)
        // 連続して二回呼ばれるのを防ぐ
        _loadMore.current = null
      }
    }
  }

  const detachScrollListener = () => {
    let scrollEl: any = window
    if (useWindow === false) {
      scrollEl = getParentElement(scrollComponent.current)
    }

    scrollEl.removeEventListener('scroll', scrollListener)
    scrollEl.removeEventListener('resize', scrollListener)
  }

  const attachScrollListener = () => {
    const parentElement = getParentElement(scrollComponent.current)

    if (!hasMore || !parentElement) {
      return
    }

    let scrollEl: any = window
    if (useWindow === false) {
      scrollEl = parentElement
    }

    scrollEl.addEventListener('scroll', scrollListener)
    scrollEl.addEventListener('resize', scrollListener)

    scrollListener()
  }

  /**
   * 渡された el の今画面の下にはみ出ている長さ
   * あとどれだけスクロールすれば、el の下端が画面の下端につくか
   */
  const calculateOffset = (el: HTMLElement, scrollTop: number) => {
    if (!el) {
      return 0
    }

    return calculateTopPosition(el) + (el.offsetHeight - scrollTop - window.innerHeight)
  }

  /**
   * 対象要素の上端のpx位置を計算
   */
  const calculateTopPosition = (el: HTMLElement) => {
    if (!el) {
      return 0
    }
    return el.offsetTop + calculateTopPosition(el.offsetParent as HTMLElement)
  }

  useMount(() => {
    attachScrollListener()
    loadMore(pageStart)
  })

  // コンポーネントが更新されるたびに呼び出す
  // detachScrollListener で外されたイベントを復活させる
  useEffect(() => {
    attachScrollListener()
    _loadMore.current = loadMore
  })

  return <div ref={scrollComponent}>{children}</div>
}
