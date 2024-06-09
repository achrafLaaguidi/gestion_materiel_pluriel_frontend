import * as React from 'react';
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const useAuth = () => {
    const [token, setToken] = useState()
    useEffect(() => {
        setToken(localStorage.getItem('token'))
    }, []);
    return token != null ? jwtDecode(token) : null
}

const CheckPermissionForRoute = (permission, Component) => {

    const user = useAuth();
    if (user) {
        return user.permissions.includes(permission) ? <Component /> : <Navigate to="/denied" replace />;
    }

}

export default CheckPermissionForRoute