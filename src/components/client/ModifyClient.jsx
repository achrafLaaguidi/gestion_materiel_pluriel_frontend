import React, { useState } from "react";
import '../../style.css';
import '../home/home.css';
import Navigation from "../home/Navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { MakeRequest } from "../../services/MakeRequest";
import { DateFormat } from "../../services/DateFormat";
import Swal from "sweetalert2";
import FormClient from "./FormClient";

export default function ModifyClient() {
    const location = useLocation();
    const rowData = location.state.data;

    const [clientData, setClientData] = useState({
        id: rowData.id,
        dénominationSociale: rowData.dénominationSociale,
        secteurActivité: rowData.secteurActivité,
        natureJuridique: rowData.natureJuridique,
        capitalSocial: rowData.capitalSocial,
        dateDeCreation: DateFormat.convertToInputDateFormat(rowData.dateDeCreation),
        adresse: rowData.adresse,
        ninscription: rowData.ninscription,
        ville: rowData.ville,
        identifiantFiscal: rowData.identifiantFiscal,
        patente: rowData.patente,
        ncnss: rowData.ncnss,
        ice: rowData.ice,
        telephone: rowData.telephone,
        fax: rowData.fax,
        email: rowData.email,
        representantLegalSociete: rowData.representantLegalSociete,
        fonction: rowData.fonction
    });

    const navigate = useNavigate()
    const handleChange = (e) => {
        const { id, name, value } = e.target;
        setClientData({ ...clientData, [name || id]: value });
    };
    const handleModify = (event) => {
        event.preventDefault();
        const data = {
            ...clientData,
            dateDeCreation: DateFormat.formatFrenchDate(clientData.dateDeCreation),
        };
        Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        }).then((result) => {
            if (result.isConfirmed) {
                MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/client/modifyClient`
                    , 'PUT', data)
                    .then(data => {
                        if (data) {
                            navigate("/clients")
                            Swal.fire({
                                position: "top",
                                icon: "success",
                                title: "This client " + clientData.dénominationSociale + " has been saved",
                                showConfirmButton: false,
                                timer: 1000
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error :', error);
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: error.message,
                        });
                    });
            } else if (result.isDenied) {
                navigate("/clients")
                Swal.fire("Changes are not saved", "", "info");
            }
        });
    }

    return (<>
        <main>
            <Navigation />
            <div className="card w-75">
                <h2 className="text-center text-dark">Modifier Client</h2>
                <FormClient handleSend={handleModify} title='Enregistrer' handleChange={handleChange} clientData={clientData} />
            </div>
        </main>
    </>)
}
