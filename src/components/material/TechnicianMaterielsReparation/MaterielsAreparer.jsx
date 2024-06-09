import React from "react";
import ListMaterielRepair from "./ListMaterielRepair";
import Navigation from "../../home/Navigation";

export default function MaterielsAreparer() {
    return (
        <><main>
            <Navigation type="materiels" />
            <div className="m-1">
                <div className="flex-row row justify-content-between m-auto align-items-center">
                    <h2>Liste Des Materiels En Réparation</h2>
                </div>
                <ListMaterielRepair />
            </div>
        </main>
        </>
    )
}