import * as React from 'react';
import DataTable from "react-data-table-component";
import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {MakeRequest} from "../../services/MakeRequest";
import {FetchListService} from "../../services/FetchListService";
import Swal from "sweetalert2";
export function ListContracts(props) {

    const userData=jwtDecode(localStorage.getItem('token'))
    const [data, setData] = useState([]);
    const [records,setRecords]=useState([])
    const navigate=useNavigate()


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const dataRecus = await FetchListService.FetchListContract()
        setData(dataRecus)
        setRecords(dataRecus)
    }
    function handleContractActivate(row) {
        try {
            MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/contract/activateContract/${row.id}`, 'PUT')
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
        navigate("/ModifyContract",{ state: {row} });

    }

    const columns = [
        {
            name: "NOM_CLIENT",
            selector: row=>row.client? row.client.dénominationSociale:"NULL",
            sortable:true,
            width: '20%'
        },
        {
            name: "CODE_De_CONTRAT",
            selector: row=>row.codeContract,
            sortable:true,
            width: '20%'
        },
        {
            name: "TITRE",
            selector: row=>row.title,
            sortable:true,
            width: '20%'
        },
        {
            name: "ÉTAT",
            cell:row=>(  <>
                {userData.permissions.includes("edit_contract") &&  <button className={`${'w-auto'} mr-3   ${row.status === 'ACTIVE' ? 'btn-success' : 'btn-warning'}`}
                                                                            onClick={() => handleContractActivate(row)}>{row.status === 'ACTIVE' ?
                    "ACTIF" : "INACTIF"}</button>}
            </>),
            width: '20%'
        },
        {
            name:"ACTION",
            cell: row => (<>
            { userData.permissions.includes("edit_contract") &&
                <>
                    <button type="button" className="w-auto mr-2 "
                            onClick={() => handleModify(row)}><i
                        className="fa-regular fa-pen-to-square"></i>
                    </button>
                </>
            }
                    {userData.permissions.includes("delete_contract") &&
                        <button className="w-auto mr-3 btn-danger" onClick={() => handleDelete(row)}>
                            <i
                            className="fa-solid fa-trash-can"></i></button>}
                </>
            ),
            width: 'auto'
        },
    ];
    const handleFind = (event) => {
        setTimeout(() => {
            const newRecords = data.filter(row => row.codeContract.toLowerCase().includes(event.target.value.toLowerCase()));
            setRecords(newRecords);
        }, 300);
    }


    return (
        <div >
            <div className="position-relative float-right">
                <i className="fa-solid fa-magnifying-glass " style={ {
                    position: 'absolute',
                    left: '8px',
                    top:'40%',
                    transform: 'translateY(-50%)'
                }}></i>
                <input type="text" placeholder="Code De Contrat" onChange={handleFind}   className="w-100 mb-2 pl-lg-4 "/>
            </div>
            <DataTable
                columns={columns}
                data={records}
                fixedHeader
                paginationRowsPerPageOptions={[5,10,20]}
                paginationPerPage={10}
                pagination={true}
                />
        </div>
    )
}