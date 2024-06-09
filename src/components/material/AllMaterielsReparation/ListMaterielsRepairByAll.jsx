import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { MakeRequest } from "../../../services/MakeRequest";
import { FetchListService } from "../../../services/FetchListService";
import { ExportToExcel } from "../../../services/ExportToExcel";
import { DateFormat } from "../../../services/DateFormat";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

export default function ListMaterielsRepairByAll() {
    const userData = jwtDecode(localStorage.getItem('token'))
    const [data, setData] = useState([])
    const [records, setRecords] = useState([])
    const navigate = useNavigate()
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const dataRecus = await FetchListService.FetchListMaterielByAll()
        setData(dataRecus)
        setRecords(dataRecus)
    };


    function handleModify(row) {
        navigate("/ModifyMaterialRepairByAll", { state: { data: row } })
    }

    function handleFiche(row) {
        navigate("/FicheTechnique", { state: { data: row } })

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

    function handleDelete(row) {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/annonce/deleteAnnonceMaterialRepair/${row.id}`,
                        'DELETE')
                        .then(data => {
                            if (data) {
                                Swal.fire({
                                    title: "deleted!",
                                    text: "Your file has been deleted.",
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
            width: '12%'
        },
        {
            name: "CLIENT",
            selector: row => row.client ? row.client.dénominationSociale : "",
            sortable: true,
            width: '13%'
        },
        {
            name: "TECHNICIEN",
            selector: row => row.technician.username,
            sortable: true,
            width: '12%'
        },
        {
            name: "ENTREE_PAR",
            selector: row => row.entreeBy,
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
                    {userData.permissions.includes("edit_materials") &&
                        <>
                            {(row.releaseDate === "" || row.releaseDate == null) && <>
                                <button className=" w-auto btn-success mr-1"
                                    title="valider"
                                    onClick={() => handleValidate(row)}>
                                    <i className="fa-solid fa-check"></i>
                                </button>
                            </>}
                            <button className="w-auto mr-1 btn-danger"
                                onClick={() => handleDelete(row)}>
                                <i className="fa-solid fa-trash-can"></i>
                            </button>
                            <button className="w-auto mr-1 " onClick={() => handleModify(row)}>
                                <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                        </>
                    }
                    {(row.releaseDate !== "" && row.releaseDate != null) &&
                        <button className=" w-auto btn-light rounded-circle" onClick={() => handleFiche(row)}>
                            <i className="fa-regular fa-eye"></i>
                        </button>}

                </>
            ),
            width: 'auto'
        },
    ];

    function handleFind(event) {
        const newRecord = data.filter(row => {
            return row.seriesNumber.toLowerCase().includes(event.target.value.toLowerCase())
        })
        setRecords(newRecord)
    }
    const handleRowSelected = React.useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);
    return (
        <div >
            <div className="flex-nowrap row justify-content-between m-2">
                <div className="w-auto">
                    <ExportToExcel apiData={selectedRows} fileName="Materiel En Reparation" />
                </div>
                <div className="position-relative w-auto">
                    <i className="fa-solid fa-magnifying-glass " style={{
                        position: 'absolute',
                        left: '8px',
                        top: '40%',
                        transform: 'translateY(-50%)'
                    }}></i>
                    <input type="text" placeholder="Numéro De Série" onChange={handleFind} className="w-100 mb-2 pl-lg-4 " />
                </div>
            </div>
            <DataTable
                columns={columns}
                data={records}
                fixedHeader
                selectableRows
                onSelectedRowsChange={handleRowSelected}
                paginationRowsPerPageOptions={[5, 8, 10, 20]}
                pagination={true} />
        </div>
    )
}