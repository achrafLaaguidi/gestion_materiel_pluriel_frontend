import React, {useEffect, useState} from "react";
import DataTable from "react-data-table-component";
import {useNavigate} from "react-router-dom";
import {FetchListService} from "../../services/FetchListService";
import {MakeRequest} from "../../services/MakeRequest";
import Swal from "sweetalert2";

export const ListRoles=()=>{

    const [listRoles,setListRoles]=useState([])
    const navigate =useNavigate()
    useEffect(() => {
        fetchListRoles()
    }, []);
    async function fetchListRoles() {
        const data = await FetchListService.FetchListRoles()
        setListRoles(data)
    }

    function handleEdit(row) {
        navigate("/ModifyRole",{state:{data:row}})
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
                    MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/user/deleteRole/${row.roleId}`, 'DELETE')
                        .then(data => {
                            if (data) {
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "Your file has been deleted.",
                                    icon: "success",
                                    showConfirmButton: false,
                                    timer: 1000
                                });
                                fetchListRoles()
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
            name: "ID",
            selector: row=>row.roleId,
            sortable:true,
            width: '10%'
        },
        {
            name: "NOM",
            selector: row=>row.roleName,
            sortable:true,
            width: '20%'
        },
        {
            name: "PERMISSIONS",
            cell: row=>
                     <select className="p-2 font-weight-bold">
                         {row.permissions.map(permission=>(
                             <option key={permission.id} className="font-weight-bold">
                                 {permission.name}
                             </option>
                         ))}
                     </select>,
            width: '20%'
        },
        {
            name: "UTILISATEUR",
            cell: row=>
                     <select className="p-2 font-weight-bold">
                         {row.users.map(user=>(
                             <option key={user.id} className="font-weight-bold">
                                 {user.username}
                             </option>
                         ))}
                     </select>,
            width: '20%'
        },
        {
            name:"ACTION",
            cell: row =>(
                <>
                    <button className="w-auto  mr-3" onClick={() => handleEdit(row)}>
                        <i className="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button className="w-auto btn-danger" onClick={() => handleDelete(row)}><i
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
                    pagination={true}/>
            </div>
        </>
    )
}