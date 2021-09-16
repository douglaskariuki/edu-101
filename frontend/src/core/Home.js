import React, {useState, useEffect} from 'react'
import auth from './../auth/auth-helper'

export default function Home() {
    const jwt = auth.isAuthenticated()

    useEffect(() => {

    }, [])

    return (
        <div>
            Home
        </div>
    )
}