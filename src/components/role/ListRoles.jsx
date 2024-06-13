import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate, Link } from "react-router-dom";
import { FetchListService } from "../../services/FetchListService";
import { handleDelete } from "../../services/HandleService";
import { jwtDecode } from "jwt-decode";
import Navigation from "../home/Navigation";

const ListRoles = () => {

    const [listRoles, setListRoles] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        fetchListRoles()
    }, []);
    async function fetchListRoles() {
        const data = await FetchListService.FetchListRoles()
        setListRoles(data)
    }

    function handleEdit(row) {
        navigate("/ModifyRole", { state: { data: row } })
    }


    const columns = [
        {
            name: "ID",
            selector: row => row.roleId,
            sortable: true,
            width: '10%'
        },
        {
            name: "NOM",
            selector: row => row.roleName,
            sortable: true,
            width: '20%'
        },
        {
            name: "PERMISSIONS",
            cell: row =>
                <select className="p-2 font-weight-bold form-select" >
                    {row.permissions.map(permission => (
                        <option key={permission.id} className="font-weight-bold">
                            {permission.name}
                        </option>
                    ))}
                </select>,
            width: '20%'
        },
        {
            name: "UTILISATEUR",
            cell: row =>
                <select className="p-2 font-weight-bold">
                    {row.users.map(user => (
                        <option key={user.id} className="font-weight-bold">
                            {user.username}
                        </option>
                    ))}
                </select>,
            width: '20%'
        },
        {
            name: "ACTION",
            cell: row => (
                <>
                    <button className="w-auto  mr-3" onClick={() => handleEdit(row)}>
                        <i className="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button className="w-auto btn-danger" onClick={() => handleDelete({ fetchData: fetchListRoles, api: `/api/v1/user/deleteRole/${row.roleId}` })}><i
                        className="fa-solid fa-trash-can"></i>
                    </button>
                </>),
            ignoreRowClick: true,
        },
    ];
    return (
        <>
            <div>
                <DataTable
                    columns={columns}
                    data={listRoles}
                    fixedHeader
                    paginationRowsPerPageOptions={[5, 8, 10]}
                    paginationPerPage={5}
                    pagination={true} />
            </div>
        </>
    )
}

export const Roles = () => {
    const userData = jwtDecode(localStorage.getItem('token'))

    return (
        <>
            <main>
                <Navigation type="roles" />
                {userData.permissions.includes("view_roles") && <div className="m-3">
                    <div className="flex-row row justify-content-between m-auto align-items-center">
                        <h2>Liste Roles</h2>
                        {userData.permissions.includes("add_role") &&
                            <Link to="/AddRole" className="rounded-bottom">
                                <button className="btn-success w-auto">
                                    <i className="fa-solid fa-plus"></i>
                                </button>
                            </Link>}
                    </div>
                    <ListRoles />
                </div>}
            </main>
        </>
    );
};