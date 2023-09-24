import { useUnmount, useUpdateEffect } from 'react-use'

/**
 * Unmountのタイミングの実験
 */
export const Hoge = ({ txt }) => {
  useUnmount(() => {
    console.log('unmount')
  })

  useUpdateEffect(() => {
    console.log('count', txt) // will only show 1 and beyond
  })

  return (
    <div>
      <p>adsfsadf: {txt}</p>
    </div>
  )
}
