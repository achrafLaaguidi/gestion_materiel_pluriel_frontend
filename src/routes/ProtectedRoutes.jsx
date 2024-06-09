import {Navigate, Outlet} from "react-router-dom"
import {jwtDecode} from "jwt-decode";

const useAuth = () => {
	const token=localStorage.getItem('token')
	return token != null ? jwtDecode(token) : null
}

const ProtectedRoutes = () => {
	const auth = useAuth()
		return auth ? <Outlet /> : <Navigate to="login" replace />

}

export default ProtectedRoutes
