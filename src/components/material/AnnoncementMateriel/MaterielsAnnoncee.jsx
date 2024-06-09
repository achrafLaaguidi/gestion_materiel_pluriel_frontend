import { Link } from "react-router-dom";
import React from "react";
import Navigation from "../../home/Navigation";
import ListMaterielsEntree from "./ListMaterielsEntree";

export default function MaterielsAnnoncee() {
    return (<><main>
        <Navigation type="materielsAnnoncée" />
        <div className="m-1">
            <div className="flex-row row justify-content-between m-auto align-items-center">
                <h2>Liste Des Annonces</h2>
                <Link to="/AddMateriel" className="mb-1" >
                    <button className="w-auto btn-success ">
                        <i className="fa-solid fa-plus"></i>
                    </button>
                </Link>
            </div>
            <ListMaterielsEntree />
        </div>
    </main>
    </>)
}