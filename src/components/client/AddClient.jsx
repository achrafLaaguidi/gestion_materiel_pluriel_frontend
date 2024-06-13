import React, { useState } from "react";
import '../../style.css';
import '../home/home.css';
import Navigation from "../home/Navigation";
import { useNavigate } from "react-router-dom";
import { MakeRequest } from "../../services/MakeRequest";
import { DateFormat } from "../../services/DateFormat";
import { ImportExcel } from "../../services/ImportExcel";
import Swal from "sweetalert2";
import FormClient from "./FormClient";


export default function AddClient() {
    const [clientData, setClientData] = useState({
        dénominationSociale: '',
        secteurActivité: '',
        natureJuridique: null,
        capitalSocial: null,
        dateDeCreation: '',
        adresse: '',
        ninscription: null,
        ville: '',
        identifiantFiscal: null,
        patente: null,
        ncnss: null,
        ice: null,
        telephone: '',
        fax: '',
        email: '',
        representantLegalSociete: '',
        fonction: null
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, name, value } = e.target;
        setClientData({ ...clientData, [name || id]: value });
    };

    const handleAdd = (event) => {
        event.preventDefault();
        const data = {
            ...clientData,
            dateDeCreation: DateFormat.formatFrenchDate(clientData.dateDeCreation),
        };

        MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/client/addClient`, 'POST', data)
            .then(response => {
                if (response) {
                    navigate("/clients");
                    Swal.fire({
                        position: "top",
                        icon: "success",
                        title: `This client ${data.dénominationSociale} has been added`,
                        showConfirmButton: false,
                        timer: 1000
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.message,
                });
            });
    };

    const handleReset = () => {
        setClientData({
            dénominationSociale: '',
            secteurActivité: '',
            natureJuridique: null,
            capitalSocial: null,
            dateDeCreation: '',
            adresse: '',
            ninscription: null,
            ville: '',
            identifiantFiscal: null,
            patente: null,
            ncnss: null,
            ice: null,
            telephone: '',
            fax: '',
            email: '',
            representantLegalSociete: '',
            fonction: null
        });
    };



    return (
        <main>
            <Navigation />
            <div className="card w-75">
                <div className="row justify-content-between m-0">
                    <h2 className="text-dark">Ajouter Client</h2>
                    <ImportExcel navigate={navigate} type="client" />
                </div>
                <FormClient handleSend={handleAdd} title="Ajouter" handleReset={handleReset} handleChange={handleChange} clientData={clientData} />
            </div>
        </main>
    );
}
