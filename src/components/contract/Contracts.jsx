import Navigation from "../home/Navigation";
import React from "react";
import {ListContracts} from "./ListContracts";

export default function Contracts(){

    return(
        <>
            <main>
                <Navigation type="contracts"/>
                <div className="m-3">
                    <div className="flex-row row justify-content-between m-auto align-items-center">
                        <h2>Liste Des Contrats</h2>
                    </div>
                    <ListContracts />
                </div>
            </main>
        </>
    )
}