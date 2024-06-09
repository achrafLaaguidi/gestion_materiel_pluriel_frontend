import * as React from 'react';
import Navigation from "../../home/Navigation";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { MakeRequest } from "../../../services/MakeRequest";
import { ExportToExcel } from "../../../services/ExportToExcel";

export function HistoryUser() {
    const userData = jwtDecode(localStorage.getItem('token'));
    const [data, setData] = useState([]);
    const [records, setRecords] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/material/listMaterialsRepairedByTechnician/${userData.sub}`, 'GET');
            if (response) {
                setData(response);
                setRecords(response);
            }
        } catch (error) {
            console.error("Erreur:", error);
        }
    };


    function handleModify(row) {
        navigate("/ModifyMaterielRepair", { state: { data: row } });
    }

    const columns = [
        {
            name: "MATERIEL",
            selector: row => row.name,
            sortable: true,
            width: '15%'
        },
        {
            name: "NUMÉRO_DE_SÉRIE",
            selector: row => row.seriesNumber,
            sortable: true,
            width: '15%'
        },
        {
            name: "CLIENT",
            selector: row => row.client ? row.client.dénominationSociale : "",
            sortable: true,
            width: '15%'
        },
        {
            name: "ENTREE_PAR",
            selector: row => row.entreeBy,
            sortable: true,
            width: '15%'
        },
        {
            name: "DATE_SORTIE",
            selector: row => row.releaseDate,
            sortable: true,
            width: '12%'
        },
        {
            name: "ACTION",
            cell: row => (
                <>
                    <button className="w-auto" onClick={() => handleModify(row)}>
                        <i className="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button className="w-auto mr-1 btn-light" title='Fiche Technique' onClick={() => navigate("/FicheTechnique", { state: { data: row } })}>
                        <i class="fa-solid fa-file-pdf"></i>                    </button>
                    <button className="w-auto  btn-warning" title='Bon De Retour' onClick={() => navigate("/BonDeRetour", { state: { data: row } })}>
                        <i class="fa-regular fa-file-pdf"></i>
                    </button>
                </>
            ),
            width: 'auto'
        },
    ];

    function handleFind(event) {
        const newRecord = data.filter(row => row.seriesNumber.toLowerCase().includes(event.target.value.toLowerCase()));
        setRecords(newRecord);
    }

    const handleRowSelected = React.useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);

    return (
        <>
            <main>
                <Navigation type="History" />
                <div className="m-1">
                    <div className="flex-row row justify-content-between m-auto align-items-center">
                        <h3>Historique des Réparations</h3>
                    </div>
                    <div>
                        <div className="flex-nowrap row justify-content-between m-2">
                            <div className="w-auto">
                                <ExportToExcel apiData={selectedRows} fileName="Materiel En Reparation" />
                            </div>
                            <div className="position-relative w-auto">
                                <i className="fa-solid fa-magnifying-glass" style={{
                                    position: 'absolute',
                                    left: '8px',
                                    top: '40%',
                                    transform: 'translateY(-50%)'
                                }}></i>
                                <input type="text" placeholder="Numéro De Série" onChange={handleFind}
                                    className="w-100 mb-2 pl-lg-4 " />
                            </div>
                        </div>
                        <DataTable
                            columns={columns}
                            data={records}
                            fixedHeader
                            paginationRowsPerPageOptions={[5, 8, 10, 20]}
                            paginationPerPage={10}
                            pagination={true}
                            selectableRows
                            onSelectedRowsChange={handleRowSelected}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}
