import React from 'react'
import { useRouter } from 'next/router'

const project = () => {
    const router = useRouter()
    const { address } = router.query

    return <p>project address: {address}</p>
}

export default project