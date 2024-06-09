import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { jwtDecode } from "jwt-decode";
import { MakeRequest } from "../../../services/MakeRequest";
import Swal from "sweetalert2";

export default function ListMaterielDemandeRepair() {

    const userData = jwtDecode(localStorage.getItem('token'))

    const [data, setData] = useState([]);
    const [records, setRecords] = useState([])
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        try {
            MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/annonce/listAnnonceMaterielByTechnician/${userData.sub}`,
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
    };

    function handleAccepte(row) {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, accept it!"
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/annonce/accepteAnnonce/${row.id}/${userData.sub}`,
                        'PUT')
                        .then(data => {
                            if (data) {
                                Swal.fire({
                                    title: "Accepted!",
                                    text: "Your file has been Accepted.",
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
            selector: row => row.client.dénominationSociale,
            sortable: true,
            width: '15%'
        },
        {
            name: "ENTRÉE_PAR",
            selector: row => row.entreeBy,
            sortable: true,
            width: '15%'
        },
        {
            name: "ACTION",
            cell: row => (
                <button className="w-auto mr-3" onClick={() => handleAccepte(row)}>
                    <i className=" fa-regular fa-circle-check"> Accepter</i>
                </button>
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
                paginationPerPage={10}
                pagination={true} />
        </div>
    );
}