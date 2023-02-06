import React from 'react'
import { useRouter } from 'next/router'

const userProfile = () => {
    const router = useRouter();
    const { walletAddress } = router.query

    return <p>freelancer walletAddress is: {walletAddress}</p>
}

export default userProfile