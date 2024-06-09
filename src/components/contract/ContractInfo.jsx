import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import DataTable from "react-data-table-component";
import * as React from "react";
import Navigation from "../home/Navigation";
import {jwtDecode} from "jwt-decode";
import {MakeRequest} from "../../services/MakeRequest";
import Swal from "sweetalert2";


export function ContractInfo() {
    const userData=jwtDecode(localStorage.getItem('token'))
    const { id } = useParams()
    const [data,setData]=useState([])
    const navigate=useNavigate()
    useEffect(() => {
        fetchData();
    },[]);

    const fetchData = () => {
        try {
            MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/contract/ContractInfo/${id}`,
                'GET')
                .then(data=>{
                    if(data){
                        setData(data);
                    }
                })
        } catch (error) {
            console.error("Erreur:", error);
        }
    };
    function handleContractActivate(row) {
        try {
            MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/contract/activateContract/${row.id}`,
                'PUT')
                .then(data=>{
                    if(data){
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
                    MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/contract/deleteContract/${row.id}`,
                        'DELETE')
                        .then(data => {
                            if (data) {
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "Your file has been deleted.",
                                    icon: "success"
                                });
                                navigate("/clients")
                            }
                        })
                } catch (error) {
                    console.error("Erreur:", error);
                }
            }
        });
    }

    function handleModify(row) {
        navigate("/ModifyContract",{ state: {row} });

    }
    const columns = [
        {
            name: "Id",
            selector: row=>row.id,
            sortable:true,
            width: '15%'
        },
        {
            name: "Code",
            selector: row=>row.codeContract,
            sortable:true,
            width: '15%'
        },
        {
            name: "Title",
            selector: row=>row.title,
            sortable:true,
            width: '15%'
        },
        {
            name: "Status",
            cell:row=>(  <>
                {userData.permissions.includes("edit_contract") &&  <button className={`${'w-auto'} mr-3   ${row.status === 'ACTIVE' ? 'btn-success' : 'btn-warning'}`}
                                                            onClick={() => handleContractActivate(row)}>{row.status === 'ACTIVE' ?
                    "ACTIF" : "INACTIF"}</button>}
            </>),
            width: '30%'
        },
        {
            name:"Action",
            cell: row => (<>
            { userData.permissions.includes("edit_contract")&&
                <>
                    <button type="button" className="mr-2 w-auto"
                            onClick={() => handleModify(row)}>
                        <i
                            className="fa-regular fa-pen-to-square"></i>
                    </button>
                    </>}

            {userData.permissions.includes("delete_contract")&&<button className="w-auto mr-3 btn-danger" onClick={() => handleDelete(row)}>
                <i className="fa-solid fa-trash-can"></i></button>
        }
</>
),
    ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        width: 'auto'
},
];

return (
    <main>
        <Navigation type="clients"/>
        <div className="m-3">
                <div className="flex-row row justify-content-between m-auto align-items-center">
                    <h2>CONTRAT DE <span style={{color:"red"}}>[{data.client? data.client.dénominationSociale : ""}]</span>  </h2>
                </div>
                <DataTable
                    columns={columns}
                    data={[data]}
                    fixedHeader
                />
            </div>
        </main>
    );
}