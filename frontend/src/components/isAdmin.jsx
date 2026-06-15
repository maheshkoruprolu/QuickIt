import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const isAdmin = ({ children }) => {
    const user = useSelector(state => state?.user)

    if (user.role === 'Admin') {
        return children
    }

    return <Navigate to="/" replace />
}

export default isAdmin
