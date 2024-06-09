import ListUsers from "./ListUsers";
import React from "react";
import {Link} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Navigation from "../home/Navigation";

export default function Users(){
    const userData=jwtDecode(localStorage.getItem('token'))
    return(
        <><main>
            <Navigation type="users"/>
            { userData.permissions.includes("view_users") &&<div className="m-3">
                <div className="flex-row row justify-content-between m-auto align-items-center">
                    <h2>Liste Utilisateurs</h2>
                    { userData.permissions.includes("add_user") && <Link to="/AddUser" className="rounded-bottom">
                        <button className="btn-success mb-1">
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </Link>}
                </div>
                <ListUsers/>
            </div>}
        </main>
        </>
    )
}