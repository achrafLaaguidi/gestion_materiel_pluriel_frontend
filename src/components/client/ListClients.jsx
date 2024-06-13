import React, { useState, useEffect, useCallback } from "react";
import DataTable from "react-data-table-component";
import '../home/home.css';
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FetchListService } from "../../services/FetchListService";
import { ExportToExcel } from "../../services/ExportToExcel";
import { handleDelete } from "../../services/HandleService";
import Navigation from "../home/Navigation";


const ListClients = () => {
    const userData = jwtDecode(localStorage.getItem('token'));
    const [data, setData] = useState([]);
    const [records, setRecords] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState(["dénominationSociale", "secteurActivité"]);
    const [allColumnsSelected, setAllColumnsSelected] = useState(false);
    const [showColumnsFields, setShowColumnsFields] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const dataRecus = await FetchListService.FetchListClient();
        setData(dataRecus);
        setRecords(dataRecus);
    };

    const handleEdit = (row) => {
        navigate("/ModifyClient", { state: { data: row } });
    };

    const availableColumns = Object.keys(records.length > 0 ? records[0] : {})
        .filter(key => key !== "ninscription" && key !== "equipmentRepairList");

    const handleContract = (row) => {
        if (row.contract === null) {
            navigate("/AddContract/" + row.id);
        } else {
            navigate("/ContractInfo/" + row.contract.id);
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
            setSelectedColumns(availableColumns);
            setAllColumnsSelected(true);
        }
    };

    const handleFind = (event) => {
        const searchValue = event.target.value.toLowerCase();
        const newRecord = data.filter(row => row.dénominationSociale.toLowerCase().includes(searchValue));
        setRecords(newRecord);
    };

    const handleRowSelected = useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);

    const columns = [
        {
            name: "NUMERO_INSCRIPTION",
            selector: row => row.ninscription,
            sortable: true,
        },
        ...selectedColumns.map(column => ({
            name: column.toUpperCase(),
            selector: row => row[column],
            sortable: true,
        })),
        {
            name: "CONTRACTUEL",
            selector: row => row.contract ? (row.contract.status === 'ACTIVE' ? row.contract.title : "NON CONTRACTUEL") : "NON CONTRACTUEL",
            sortable: true,
        },
        {
            name: "ACTION",
            cell: row => (
                <>
                    <button type="button" title="Fiche Client" className="w-auto mr-1 btn-info" onClick={() => navigate("/ClientsInfo", { state: { data: row } })}>
                        <i className="fa-solid fa-circle-info"></i>
                    </button>
                    {userData.permissions.includes("edit_client") &&
                        <button type="button" className="w-auto mr-1" onClick={() => handleEdit(row)}>
                            <i className="fa-regular fa-pen-to-square"></i>
                        </button>}
                    {userData.permissions.includes("delete_client") &&
                        <button type="button" className="w-auto mr-1 btn-danger" onClick={() => handleDelete({ fetchData: fetchData, api: `/api/v1/client/deleteClient/${row.id}` })}>
                            <i className="fa-solid fa-trash-can"></i>
                        </button>}
                    {
                        row.contract ? (
                            userData.permissions.includes("view_contracts") &&
                            <button type="button" title="Contrat" className="w-auto btn-light" onClick={() => handleContract(row)}>
                                <i className="fa-regular fa-eye"></i>
                            </button>
                        ) : (
                            userData.permissions.includes("add_contract") &&
                            <button type="button" title="ajouter contrat" className="w-auto btn-warning" onClick={() => handleContract(row)}>
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        )
                    }
                </>
            ),
            width: 'auto',
        }
    ];

    return (
        <div>
            <div className="w-25 mr-1">
                <ExportToExcel apiData={selectedRows} fileName="Clients" />
            </div>
            <div className="row flex-nowrap justify-content-between align-items-center p-2">
                <div>
                    <button className="btn-light mb-1" onClick={() => setShowColumnsFields(!showColumnsFields)}>
                        <i className="fa-solid fa-list"></i>
                    </button>
                    {showColumnsFields && (
                        <div className="list w-100">
                            <div className="border-bottom row">
                                <input
                                    type="checkbox"
                                    id="selectAllColumns"
                                    checked={allColumnsSelected}
                                    onChange={handleToggleAllColumns}
                                />
                                <label htmlFor="selectAllColumns">All</label>
                            </div>
                            {availableColumns.map((column) => (
                                <div key={column} className="row">
                                    <input
                                        type="checkbox"
                                        id={column}
                                        value={column}
                                        checked={selectedColumns.includes(column)}
                                        onChange={() => handleColumnSelectChange(column)}
                                    />
                                    <label htmlFor={column}>{column}</label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="position-relative">
                    <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '8px', top: '40%', transform: 'translateY(-50%)' }}></i>
                    <input type="text" placeholder="Dénomination Sociale" onChange={handleFind} className="w-100 mb-2 pl-lg-4" />
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
                pagination
            />
        </div>
    );
};

export default function Clients() {
    const userData = jwtDecode(localStorage.getItem('token'))
    return (
        <><main>
            <Navigation />
            {userData.permissions.includes("view_clients") && <div className="m-3">
                <div className="flex-row row justify-content-between m-auto align-items-center">
                    <h2>Liste Clients</h2>
                    {userData.permissions.includes("add_client") && <Link to="/AddClient" className="rounded-bottom">
                        <button className="btn-success"><i className="fa-solid fa-plus"></i></button>
                    </Link>}
                </div>
                <ListClients />
            </div>}
        </main>
        </>
    )
}
