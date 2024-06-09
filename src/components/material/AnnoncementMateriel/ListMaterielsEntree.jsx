import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { jwtDecode } from "jwt-decode";
import { FetchListService } from "../../../services/FetchListService";
import { MakeRequest } from "../../../services/MakeRequest";
import Swal from "sweetalert2";

export default function ListMaterielsEntree() {
    const userData = jwtDecode(localStorage.getItem('token'))
    const [data, setData] = useState([]);
    const [records, setRecords] = useState([])
    const [technician, setTechnician] = useState(null);
    const [listTechnician, setListTechnician] = useState([])

    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const navigate = useNavigate()
    useEffect(() => {
        fetchData();
        fetchListTechnician()
    }, []);
    async function fetchListTechnician() {
        const data = await FetchListService.FetchListUserActive()
        setListTechnician(data.map(data => ({
            id: data.id,
            username: data.username
        })))
        setTechnician(listTechnician[0])
    }
    const fetchData = () => {
        try {
            MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/material/listMaterialsEntree`,
                'GET')
                .then(data => {
                    if (data) {
                        setData(data)
                        setRecords(data)
                    }
                })
        } catch (error) {
            console.error("Erreur:", error);
        }
    }


    function handleAnnonce(row) {
        const materielData = {
            id: row.id,
            seriesNumber: row.seriesNumber,
            name: row.name,
            technician: technician
        }
        try {
            MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/annonce/annonceMaterielRepair`,
                'POST',
                materielData)
                .then(data => {
                    if (data) {
                        fetchData()
                    }
                })
        } catch (error) {
            console.error("Erreur:", error);
        }
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

    function handleModify(row) {
        navigate("/ModifyAnnonceMateriel", { state: { data: row } })

    }
    function handleAccepte(row) {
        try {
            MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/annonce/accepteAnnonce/${row.id}/${userData.sub}`,
                'PUT')
                .then(data => {
                    if (data) {
                        navigate("/materielsAreparer")
                    }
                })
        } catch (error) {
            console.error("Erreur:", error);
        }
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
            selector: row => row.client.dénominationSociale,
            sortable: true,
            width: '15%'
        },
        {
            name: "ENTÉE_PAR",
            selector: row => row.entreeBy,
            sortable: true,
            width: '10%'
        },
        {
            name: "TECHNICIEN",
            cell: row =>
                row.technician == null ? (<>
                    <input list="id_datalist1"
                        className="form-control"
                        onChange={e => {
                            const selected = listTechnician.find(technicien => technicien.username === e.target.value);
                            if (selected)
                                setTechnician(selected)
                            else
                                setTechnician(null)
                        }
                        }
                        placeholder="Enter Username"
                        onKeyUp={handleSearch} />
                    <datalist id="id_datalist1" className="w-100  p-2 ">
                        <option value="ALL" />
                        {listTechnician
                            .filter(technicien => technicien.username.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(technicien => (
                                <option key={technicien.id} value={technicien.username} />
                            ))}
                    </datalist>
                </>
                ) : <span>{row.technician.username}</span>,
            width: '10%'
        },
        {
            name: "DATE_ENTREE",
            selector: row => row.entryDate,
            sortable: true,
            width: '12%'
        },
        {
            name: "ACTION",
            cell: row => (
                <>
                    {row.technician === null
                        ? <>
                            <button className="w-auto mr-1 btn-light" title="Annoncer" onClick={() => handleAnnonce(row)}>
                                <i className="fa-solid fa-paper-plane"></i>
                            </button>
                        </>
                        : <>{row.technician.username === userData.sub &&
                            <button className="w-auto mr-1 btn-warning" onClick={() => handleAccepte(row)}>
                                <i className=" fa-regular fa-circle-check">Accepte</i>
                            </button>}
                            <button className="w-auto mr-1 btn-success" disabled>
                                <i className=" fa-regular fa-circle-check"></i>
                            </button>
                        </>
                    }
                    {userData.permissions.includes("edit_annonce") &&
                        <>
                            <button className="w-auto mr-1 btn-danger" onClick={() => handleDelete(row)}>
                                <i className="fa-solid fa-trash-can"></i>
                            </button>
                            <button className="w-auto" onClick={() => handleModify(row)}>
                                <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                        </>
                    }


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
    return (
        <div >
            <div className="position-relative float-right">
                <i className="fa-solid fa-magnifying-glass " style={{
                    position: 'absolute',
                    left: '8px',
                    top: '40%',
                    transform: 'translateY(-50%)'
                }}></i>
                <input type="text" placeholder="Numéro De Serie" onChange={handleFind} className="w-100 mb-2 pl-lg-4 " />
            </div>
            <DataTable
                columns={columns}
                data={records}
                fixedHeader
                paginationRowsPerPageOptions={[5, 8, 10, 20]}
                paginationPerPage={10}
                pagination={true} />
        </div>
    )
}