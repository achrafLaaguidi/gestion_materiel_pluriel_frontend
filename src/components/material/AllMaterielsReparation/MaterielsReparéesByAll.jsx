import Navigation from "../../home/Navigation";
import React from "react";
import ListMaterielsRepairByAll from "./ListMaterielsRepairByAll";

export default function MaterielsRepareesByAll() {
    return (<><main>
        <Navigation type="materielsReparées" />
        <div className="m-1">
            <div className="flex-row row justify-content-between m-auto align-items-center">
                <h2>Liste Des Matériels En Attente</h2>
            </div>
            <ListMaterielsRepairByAll />
        </div>
    </main>
    </>)
}