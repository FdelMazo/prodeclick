import { useRouter } from 'next/router'
import React from 'react'


export default function Error() {
  const router = useRouter()
  React.useEffect(() => {
    router.push(
      {
        pathname: '/',
        query: { error: '404' },
      }
    )
  }, [])
  return <></>
}
