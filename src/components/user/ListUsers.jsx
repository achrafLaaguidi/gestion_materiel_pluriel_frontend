import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import '../home/home.css';
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { MakeRequest } from "../../services/MakeRequest";
import { FetchListService } from "../../services/FetchListService";
import { handleDelete } from "../../services/HandleService";
import Navigation from "../home/Navigation";


function ListUsers() {
    const [data, setData] = useState([]);
    const userData = jwtDecode(localStorage.getItem('token'))
    const [records, setRecords] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const dataRecus = await FetchListService.FetchListUser()
        if (userData.role !== 'ADMIN') {
            setData(dataRecus.filter(row => row.role.roleName !== 'ADMIN'))
            setRecords(dataRecus.filter(row => row.role.roleName !== 'ADMIN'))
        } else {
            setData(dataRecus)
            setRecords(dataRecus)
        }
    };

    function handleEdit(row) {
        navigate("/ModifyUser", { state: { row } });
    }

    function handleActivate(row) {
        if (row.role.roleName !== 'ADMIN') {
            try {
                MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/user/activateUser/${row.id}`, 'PUT')
                    .then(data => {
                        if (data) {
                            fetchData()
                        }
                    })
            } catch (error) {
                console.error("Erreur:", error);
            }

        }

    }


    const columns = [
        {
            name: "ID",
            selector: row => row.id,
            sortable: true,
            width: '10%'
        },
        {
            name: "ROLE",
            selector: row => row.role != null ? row.role.roleName : "No role",
            sortable: true,
            width: '15%'
        },
        {
            name: "NOM_UTILISATEUR",
            selector: row => row.username,
            sortable: true,
            width: '20%'
        },
        {
            name: "ÉTAT",
            cell: row => (<>
                {<button className={`${'w-auto'} mr-3   ${row.status === 'ACTIVE' ? 'btn-success' : 'btn-warning'} ${row.role.roleName === 'ADMIN' && 'disabled'}`}
                    onClick={() => handleActivate(row)}>{row.status === 'ACTIVE' ?
                        "ACTIF" : "INACTIF"}</button>}
            </>),
            width: '30%'
        },
        {
            name: "ACTION",
            cell: row => (
                <>
                    {userData.permissions.includes("edit_user") &&
                        <>
                            <button className="w-auto mr-3" onClick={() => handleEdit(row)}>
                                <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                        </>
                    }
                    {(userData.permissions.includes("delete_user") && row.role.roleName !== 'ADMIN' && row.equipmentRepairList != null) &&
                        <button className="w-auto btn-danger" onClick={() => handleDelete({ fetchData: fetchData, api: `/api/v1/user/deleteUser/${row.id}` })}>
                            <i className="fa-solid fa-trash-can"></i>
                        </button>
                    }

                </>),
            ignoreRowClick: true,
            width: 'auto'
        },
    ];
    function handleFind(event) {
        const newRecord = data.filter(row => { return row.username.toLowerCase().includes(event.target.value.toLowerCase()) })
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
                <input type="text" placeholder="Username" onChange={handleFind} className="w-100 mb-2 pl-lg-4 " />
            </div>
            <DataTable
                columns={columns}
                data={records}
                fixedHeader
                paginationRowsPerPageOptions={[5, 10]}
                paginationPerPage={10}
                pagination={true} />
        </div>
    );
}
export default function Users() {
    const userData = jwtDecode(localStorage.getItem('token'))
    return (
        <><main>
            <Navigation type="users" />
            {userData.permissions.includes("view_users") && <div className="m-3">
                <div className="flex-row row justify-content-between m-auto align-items-center">
                    <h2>Liste Utilisateurs</h2>
                    {userData.permissions.includes("add_user") && <Link to="/AddUser" className="rounded-bottom">
                        <button className="btn-success mb-1">
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </Link>}
                </div>
                <ListUsers />
            </div>}
        </main>
        </>
    )
}
