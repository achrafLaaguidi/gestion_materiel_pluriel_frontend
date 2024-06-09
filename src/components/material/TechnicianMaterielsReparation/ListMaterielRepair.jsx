
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { jwtDecode } from "jwt-decode";
import { MakeRequest } from "../../../services/MakeRequest";
import { DateFormat } from "../../../services/DateFormat";
import Swal from "sweetalert2";

export default function ListMaterielRepair() {
    const userData = jwtDecode(localStorage.getItem('token'))
    const [data, setData] = useState([]);
    const [records, setRecords] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        try {
            MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/material/listMaterialsRepairByTechnician/${userData.sub}`,
                'GET')
                .then(data => {
                    if (data) {
                        setData(data);
                        setRecords(data);
                    }
                })
        } catch (error) {
            console.error("Erreur:", error);
        }
    }

    function handleModify(row) {
        navigate("/ModifyMaterielRepair", { state: { data: row } })
    }



    function handleValidate(row) {
        const materielData = {
            id: row.id,
            releaseDate: DateFormat.formatFrenchDate(new Date().toISOString().split('T')[0])
        }
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#6be000",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, validate it!"
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/material/validateMaterial`, 'PUT', materielData)
                        .then(data => {
                            if (data) {
                                Swal.fire({
                                    title: "validated!",
                                    text: "Your file has been validated.",
                                    icon: "success",
                                    showConfirmButton: false,
                                    timer: 1000
                                });
                                fetchData()
                            }
                        })
                } catch (error) {
                    console.error("Erreur:", error);
                }

            }
        });
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
            selector: row => row.client && row.client.dénominationSociale,
            sortable: true,
            width: '15%'
        },
        {
            name: "DUREE_INTERVENTION",
            selector: row => row.dureeIntervention,
            sortable: true,
            width: '15%'
        },
        {
            name: "DATE_ENTREE",
            selector: row => row.entryDate,
            sortable: true,
            width: '15%'
        },
        {
            name: "ACTION",
            cell: row => (
                <>
                    {(row.releaseDate == null || row.releaseDate === "") && (<>
                        <button className="w-auto mr-1 btn-success" onClick={() => handleValidate(row)}>
                            <i className="fa-solid fa-check"> Valider</i>
                        </button>
                    </>
                    )}
                    <button className="w-auto mr-2" onClick={() => handleModify(row)}>
                        <i className="fa-regular fa-pen-to-square"></i>

                    </button>
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
        <div >
            <div className="position-relative float-right">
                <i className="fa-solid fa-magnifying-glass " style={{
                    position: 'absolute',
                    left: '8px',
                    top: '40%',
                    transform: 'translateY(-50%)'
                }}></i>
                <input type="text" placeholder="Numéro De Série" onChange={handleFind} className="w-100 mb-2 pl-lg-4 " />
            </div>
            <DataTable
                columns={columns}
                data={records}
                fixedHeader
                paginationRowsPerPageOptions={[5, 8, 10, 20]}
                paginationPerPage={5}
                pagination={true} />
        </div>
    )
}
