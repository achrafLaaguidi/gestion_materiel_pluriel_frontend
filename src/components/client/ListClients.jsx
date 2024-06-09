import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import '../home/home.css';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { MakeRequest } from "../../services/MakeRequest";
import { FetchListService } from "../../services/FetchListService";
import { ExportToExcel } from "../../services/ExportToExcel";
import Swal from "sweetalert2";

export default function ListClients() {
    const userData = jwtDecode(localStorage.getItem('token'))
    const [data, setData] = useState([]);
    const [records, setRecords] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState(["dénominationSociale", "secteurActivité"]);
    const [allColumnsSelected, setAllColumnsSelected] = useState(false);
    const [showColumnsFields, setShowColumnsFields] = useState(false);
    let availableColumns = [];
    const [selectedRows, setSelectedRows] = useState([]);


    const navigate = useNavigate();

    useEffect(() => {
        fetchData()
    }, []);

    const toggleColumnFields = () => {
        setShowColumnsFields(!showColumnsFields);
    };
    const fetchData = async () => {
        const dataRecus = await FetchListService.FetchListClient()
        setData(dataRecus);
        setRecords(dataRecus);
    };


    function handleEdit(row) {
        console.log(row)
        navigate("/ModifyClient", { state: { data: row } });
    }

    Object.keys(records.length > 0 ? records[0] : {})
        .filter(key => key !== "ninscription" && key !== "equipmentRepairList")
        .map(key => availableColumns.push(key)
        );

    const handleDelete = (row) => {
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
                    MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/client/deleteClient/${row.id}`, 'DELETE')
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
    };

    const handleContract = (row) => {
        if (row.contract === null) {
            navigate("/AddContract/" + row.id);
        } else {
            navigate("/ContractInfo/" + row.contract.id)
        }
    };

    const handleColumnSelectChange = (selected) => {
        if (selectedColumns.includes(selected)) {
            setSelectedColumns(selectedColumns.filter(column => column !== selected));
        } else {
            setSelectedColumns([...selectedColumns, selected]);
        }
        setAllColumnsSelected(selectedColumns.length === availableColumns.length - 1);
    };

    const handleToggleAllColumns = () => {
        if (allColumnsSelected) {
            setSelectedColumns([]);
            setAllColumnsSelected(false);
        } else {
            setSelectedColumns(Object.keys(records.length > 0 ? records[0] : {}).filter(key => key !== "equipmentRepairList"));
            setAllColumnsSelected(true);
        }
    };
    const columns = [
        {
            name: "NUMERO_INSCRIPTION",
            selector: row => row.ninscription,
            sortable: true,
        }
    ]
    selectedColumns
        .filter(column => column !== "contract" && column !== "ninscription")
        .map(column => columns.push({
            name: column.toUpperCase(),
            selector: row => row[column],
            sortable: true,
        }));
    columns.push(
        {
            name: "CONTRACTUEL",
            selector: row => {
                if (row.contract != null && row.contract.status === 'ACTIVE') {
                    return row.contract.title
                }
                else {
                    return "NON CONTRACTUEL"
                }
            },
            sortable: true,
        },
        {
            name: "ACTION",
            cell: row => (
                <>
                    <button type="button" title="Fiche Client" className="w-auto mr-1 btn-info"
                        onClick={() => navigate("/ClientsInfo", { state: { data: row } })}>
                        <i className="fa-solid fa-circle-info"></i>
                    </button>
                    {userData.permissions.includes("edit_client") &&
                        <button type="button" className="w-auto mr-1" onClick={() => handleEdit(row)}><i
                            className="fa-regular fa-pen-to-square"></i></button>}
                    {userData.permissions.includes("delete_client") && <button type="button" className="w-auto mr-1 btn-danger" onClick={() => handleDelete(row)}>
                        <i className="fa-solid fa-trash-can"></i>
                    </button>}
                    {row.contract != null ? (
                        userData.permissions.includes("view_contracts") && (
                            <button type="button" title="Contrat" className="w-auto btn-light" onClick={() => handleContract(row)}>
                                <i className="fa-regular fa-eye"></i>
                            </button>
                        )
                    ) : (
                        userData.permissions.includes("add_contract") && (
                            <button type="button" title="ajouter contrat" className="w-auto btn-warning" onClick={() => handleContract(row)}><i
                                className="fa-solid fa-plus"></i></button>
                        )
                    )}
                </>
            ),
            width: 'auto'
        }
    )



    function handleFind(event) {
        const newRecord = data.filter(row => row.dénominationSociale.toLowerCase().includes(event.target.value.toLowerCase()))
        setRecords(newRecord)
    }
    const handleRowSelected = React.useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);

    return (
        <div>
            <div className="w-25 mr-1">
                <ExportToExcel apiData={selectedRows} fileName="Clients" />
            </div>
            <div className="row flex-nowrap justify-content-between align-items-center p-2">
                <div>
                    <button className="btn-light mb-1" onClick={toggleColumnFields}><i className="fa-solid fa-list"></i>
                    </button>
                    {showColumnsFields && (
                        <div className="list w-100 ">
                            <div className="border-bottom row">
                                <input type="checkbox" id="selectAllColumns" checked={allColumnsSelected}
                                    onChange={handleToggleAllColumns} />
                                <label htmlFor="selectAllColumns">All</label>
                            </div>
                            {availableColumns.map((column) =>
                                <div key={column} className="row">
                                    <input type="checkbox"
                                        id={column}
                                        value={column}
                                        checked={selectedColumns.includes(column)}
                                        onChange={() => handleColumnSelectChange(column)} />
                                    <label htmlFor={column}>{column}</label>
                                </div>)
                            }
                        </div>)}
                </div>
                <div className="position-relative ">
                    <i className="fa-solid fa-magnifying-glass " style={{
                        position: 'absolute',
                        left: '8px',
                        top: '40%',
                        transform: 'translateY(-50%)'
                    }}></i>
                    <input type="text" placeholder="Dénomination Sociale" onChange={handleFind}
                        className="w-100 mb-2 pl-lg-4 " />
                </div>
            </div>
            <DataTable
                selectableRows
                onSelectedRowsChange={handleRowSelected}
                columns={columns}
                data={records}
                fixedHeader
                paginationRowsPerPageOptions={[5, 10, 20]}
                paginationPerPage={10}
                pagination={true} />
        </div>
    );
}
