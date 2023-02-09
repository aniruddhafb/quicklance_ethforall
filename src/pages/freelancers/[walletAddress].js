import React from 'react'
import { useRouter } from 'next/router'

const userProfile = () => {
    const router = useRouter();
    const { walletAddress } = router.query

    return (
        <div className="h-[100vh] bg-[#111827] pt-6">freelancer walletAddress is: {walletAddress}</div>
    )
}

export default userProfile