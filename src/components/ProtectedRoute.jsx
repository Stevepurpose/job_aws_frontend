import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import backendUrl from "../Back";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

//component wraps all protected routes
function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const res = await backendUrl.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };

    //function to check if we need to refresh token
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token); //decode token
        const tokenExpiration = decoded.exp; //time to expire
        const now = Date.now() / 1000; //convert millisecs to secs

        if (tokenExpiration < now) {
            //if token expiration is less than current time, it means token has expired and needs refresh
            await refreshToken();
        } else {
            //token expiration is greater than current time
            setIsAuthorized(true);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/signup" />;
}

export default ProtectedRoute;
