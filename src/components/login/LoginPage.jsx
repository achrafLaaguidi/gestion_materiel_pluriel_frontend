import React, { useState } from 'react';
import './style.css'
import { useNavigate } from "react-router-dom";
import { loginService } from "../../services/loginService"
import { MakeRequest } from "../../services/MakeRequest";
import images from "../../images/Images";
import Swal from "sweetalert2";
export default function LoginPage() {


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();
        const loginData = {
            username,
            password
        };
        MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/user/authenticate`,
            'POST', loginData)
            .then(data => {
                if (data) {
                    loginService.saveToken(data.access_token)
                    window.location.reload()
                }
            })
            .catch(error => {
                console.error('Error :', error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.message,
                });
            })
    }
    return (
        <div className="login-Page">
            <section className="container">
                <div className="form-container row flex-row flex-nowrap justify-content-center align-items-center w-75 m-0">
                    <div className="circle circle-one "></div>
                    <div className="w-50 m-0 row flex-row align-items-center justify-content-center ">
                        <img
                            className="w-75"
                            src={images.Illustration}
                            alt="illustration" />
                    </div>
                    <div className="login-container ">
                        <div className=" ">
                            <div className="row flex-row justify-content-between align-items-center">
                                <h1 className="opacity">LOGIN</h1>
                                <img
                                    className="w-25"
                                    alt="PLURIEL"
                                    src={images.PlurielLogo} />
                            </div>
                            <form onSubmit={handleLogin}>
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input
                                        placeholder="username"
                                        style={{
                                            color: "black"
                                        }}
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                        }}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                    <input type="password"
                                           placeholder="password"
                                        style={{
                                            color: "black"
                                        }}
                                        className="form-control"
                                        id="exampleInputPassword1"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="opacity">Login</button>
                            </form>
                        </div>
                    </div>
                    <div className="circle circle-two"></div>
                    <div className="theme-btn-container"></div>
                </div>
            </section>
        </div>
    );
}