
import * as React from 'react';
import {Link} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {ListRoles} from "./ListRoles";
import Navigation from "../home/Navigation";

export const Roles = () => {
    const userData=jwtDecode(localStorage.getItem('token'))

    return (
        <>
            <main>
                <Navigation type="roles"/>
                {userData.permissions.includes("view_roles") && <div className="m-3">
                    <div className="flex-row row justify-content-between m-auto align-items-center">
                        <h2>Liste Roles</h2>
                        {userData.permissions.includes("add_role") &&
                            <Link to="/AddRole" className="rounded-bottom">
                                <button className="btn-success w-auto">
                                    <i className="fa-solid fa-plus"></i>
                                </button>
                            </Link>}
                    </div>
                    <ListRoles/>
                </div>}
            </main>
        </>
    );
};