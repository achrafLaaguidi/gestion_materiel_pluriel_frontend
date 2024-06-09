import Navigation from "../home/Navigation";
import React from "react";
import {Link} from "react-router-dom";
import ListClients from "./ListClients";
import {jwtDecode} from "jwt-decode";

export default function Clients(){
    const userData=jwtDecode(localStorage.getItem('token'))
    return(
        <><main>
            <Navigation type="clients"/>
            { userData.permissions.includes("view_clients") && <div className="m-3">
                <div className="flex-row row justify-content-between m-auto align-items-center">
                    <h2>Liste Clients</h2>
                    { userData.permissions.includes("add_client") &&<Link to="/AddClient" className="rounded-bottom">
                        <button className="btn-success"><i className="fa-solid fa-plus"></i></button>
                    </Link>}
                </div>
                <ListClients/>
            </div>}
        </main>
        </>
    )
}