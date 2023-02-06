import React from 'react'
import { useRouter } from 'next/router'

const Job = () => {
    const router = useRouter()
    const { address } = router.query

    return <p>Job address: {address}</p>
}

export default Job