import * as React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FetchListService } from "../../../services/FetchListService";
export const LastMaterialsRepair = () => {
    const [data, setData] = useState([]);
    const [records, setRecords] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        const dataRecus = await FetchListService.FetchListMaterielOfDay()
        setData(dataRecus)
        setRecords(dataRecus)
    }


    function handleModify(row) {
        navigate("/ModifyMaterialRepairByAll", { state: { data: row } })
    }

    function handleFiche(row) {
        navigate("/FicheTechnique", { state: { data: row } })

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
            name: "TECHNICEN",
            selector: row => row.technician != null ? row.technician.username : "ALL",
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
            name: "ACTION",
            cell: row => (
                <>
                    <button className="w-auto mr-1 " onClick={() => handleModify(row)}>
                        <i className="fa-regular fa-pen-to-square"></i>
                    </button>
                    {(row.releaseDate !== "" && row.releaseDate != null) &&
                        <button className="w-auto mr-1 btn-light" title='Fiche Technique' onClick={() => navigate("/FicheTechnique", { state: { data: row } })}>
                            <i class="fa-solid fa-file-pdf"></i>
                        </button>}

                </>
            ),
            width: 'auto'
        },
    ];
    function handleFind(event) {
        const newRecord = data.filter(row => { return row.seriesNumber.toLowerCase().includes(event.target.value.toLowerCase()) })
        setRecords(newRecord)
    }

    return (
        <div>
            <div className="flex-nowrap row float-right m-2">
                <div className="position-relative w-auto">
                    <i className="fa-solid fa-magnifying-glass " style={{
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
                paginationRowsPerPageOptions={[5, 8, 10]}
                paginationPerPage={10}
                pagination={true} />
        </div>
    )
};