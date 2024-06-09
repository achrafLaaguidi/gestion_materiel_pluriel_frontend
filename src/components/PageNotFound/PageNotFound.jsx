
import * as React from 'react'
import "./notFound.css"
import {useNavigate} from "react-router-dom";
export const PageNotFound = () => {
    const navigate=useNavigate()

    return (
        <div className="not_found">
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="main">
                <h1>404</h1>
                <p>It looks like you're lost...<br/>That's a trouble?</p>
                <button type="button" onClick={()=>navigate("/")}>Go back</button>
            </div>
        </div>


    );
};