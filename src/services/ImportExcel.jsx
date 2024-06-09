import * as React from 'react';
import * as XLSX from "xlsx";
import {MakeRequest} from "./MakeRequest";
import Swal from "sweetalert2";

export const ImportExcel =  ({ navigate, userData,type}) => {

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: "array"});

            // Suppose que la première feuille du fichier Excel contient les données
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            // Convertit les données de la feuille Excel en tableau JSON
            const excelData = XLSX.utils.sheet_to_json(worksheet);
            if (excelData.length > 0) {
                if (type === "materiel") {
                    const mappedData = excelData.map(item => ({
                        seriesNumber: item["NUMERO_DE_SERIE"],
                        name: item["MATERIELS"],
                        technician: {
                            username: item["TECHNICIEN"]
                        },
                        client: {
                            dénominationSociale: item["CLIENT"],
                            secteurActivité: item["CLIENT"]
                        },
                        entryDate: item["DATE_ENTRER"],
                        releaseDate: item["DATE_RETOUR"],
                        intervention: item["REMARQUE"]
                    }));
                    MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/material/addListMaterielRepair`,
                        'POST',
                        mappedData)
                        .then(data => {
                            if (data) {
                                if (userData.permissions.includes('view_materials')) {
                                    navigate("/MaterielsRepareesByAll");
                                    Swal.fire({
                                        position: "top",
                                        icon: "success",
                                        title: "Your materials have been added.",
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                } else {
                                    navigate("/historyUser");
                                    Swal.fire({
                                        position: "top",
                                        icon: "success",
                                        title: "Your materials have been added.",
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                }
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
                }
                if (type === "client") {
                    const mappedData = excelData.map(item => ({
                        dénominationSociale: item["CLIENT"],
                        ninscription: item["NUMERO_INSCRIPTION"],
                        ville: item["VILLE"],
                    }));

                    MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/client/addListClient`,
                        'POST',
                        mappedData)
                        .then(data => {
                            if (data) {
                                navigate("/clients")
                                Swal.fire({
                                    position: "top",
                                    icon: "success",
                                    title: "Your clients have been added.",
                                    showConfirmButton: false,
                                    timer: 1500
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
                }

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Le fichier Excel est vide.",
                });
            }
        };
        if (file != null)
            reader.readAsArrayBuffer(file);
    }


    return (
        <button type="button" className="w-25 rounded-pill h-0  ">
            <label htmlFor="file-upload">
                Importer
            </label>
            <input
                id="file-upload"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                style={{
                    display: "none",
                }}
            />
        </button>
    );
}
