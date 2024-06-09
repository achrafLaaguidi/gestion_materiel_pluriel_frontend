import './home.css';
import Navigation from "./Navigation";
import {jwtDecode} from "jwt-decode";
import ListMaterielDemandeRepair from "../material/AnnoncementMateriel/ListMaterielDemandeRepair";
import {LastMaterialsRepair} from "../material/AllMaterielsReparation/LastMaterialsRepair";

export default function Home(){
    const userData=jwtDecode(localStorage.getItem('token'))
    return(
        <>
            <main>
                <Navigation type="home"/>
                <section className="m-1">
                    {userData.role === 'ADMIN' ?
                        <div className="m-1">
                            <h2>Des Materiels De Jour</h2>
                            <div>
                                <LastMaterialsRepair/>
                            </div>
                        </div>
                        :
                        <div className="m-1">
                            <h2>Annoncement Des Materiels</h2>
                            <div>
                                <ListMaterielDemandeRepair/>
                            </div>
                        </div>}
                </section>
            </main>
        </>
                        )
                    }