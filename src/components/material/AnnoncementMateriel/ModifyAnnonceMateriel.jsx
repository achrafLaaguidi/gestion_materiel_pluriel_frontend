import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "../../home/Navigation";
import { FetchListService } from "../../../services/FetchListService";
import { MakeRequest } from "../../../services/MakeRequest";
import { DateFormat } from "../../../services/DateFormat";
import Swal from "sweetalert2";

export default function ModifyAnnonceMateriel() {
    const location = useLocation()
    const rowData = location.state.data

    const [seriesNumber, setSeriesNumber] = useState(rowData.seriesNumber);
    const [name, setName] = useState(rowData.name);
    const [type, setType] = useState(rowData.type);
    const entryDateRef = useRef();
    const [entreeBy, setEntreeBy] = useState(rowData.entreeBy);
    const [technician, setTechnician] = useState({})
    const [client, setClient] = useState({});
    const navigate = useNavigate()

    const [listClient, setListClient] = useState([])
    const [listTechnician, setListTechnician] = useState([])

    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };


    useEffect(() => {
        fetchListClient()
        fetchListTechnician()
    }, []);
    useEffect(() => {
        if (rowData && rowData.client) {
            const selectedClient = listClient.find(client => client.id === rowData.client.id);
            if (selectedClient) {
                setClient(selectedClient);
            }
        }
    }, [listClient, rowData]);

    useEffect(() => {
        if (rowData && rowData.technician) {
            const selectedTechnician = listTechnician.find(technician => technician.id === rowData.technician.id);
            if (selectedTechnician) {
                setTechnician(selectedTechnician);
            }
        }
    }, [listTechnician, rowData]);

    async function fetchListTechnician() {
        const data = await FetchListService.FetchListUserActive()
        setListTechnician(data.map(data => ({
            id: data.id,
            username: data.username
        })))

    }
    async function fetchListClient() {
        const data = await FetchListService.FetchListClient()
        setListClient(data)
    }

    function handleModify(event) {
        event.preventDefault()
        const materielData = {
            id: rowData.id,
            seriesNumber: seriesNumber,
            name: name,
            type: type,
            client: client,
            entreeBy: entreeBy,
            technician: technician,
            entryDate: DateFormat.formatFrenchDate(entryDateRef.current.value)
        }
        Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        }).then((result) => {
            if (result.isConfirmed) {
                MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/annonce/modifyAnnonceMaterielRepair`
                    , 'PUT', materielData)
                    .then(data => {
                        if (data) {
                            navigate("/materielsAnnoncee")
                            Swal.fire({
                                position: "top",
                                icon: "success",
                                title: "This Material " + materielData.name + " has been saved",
                                showConfirmButton: false,
                                timer: 1000
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error :', error);
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: error.message,
                        });
                    });
            } else if (result.isDenied) {
                navigate("/materielsAnnoncée")
                Swal.fire("Changes are not saved", "", "info");
            }
        });

    }

    return (
        <>
            <main>
                <Navigation type="materielsAnnoncée" />
                <div className="card w-75">
                    <h2 className="text-center text-dark">Modifier Matériel à Réparer</h2>
                    <form onSubmit={handleModify} className="flex-column flex-wrap">
                        <div className="m-0 row">
                            <div className="w-50  ">
                                <label htmlFor="exampleInputText1" className="form-label">Numéro De Serie</label>
                                <input type="text"
                                    className="form-control"
                                    id="exampleInputText1"
                                    value={seriesNumber}
                                    onChange={(e) => {
                                        setSeriesNumber(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="w-50">
                                <label htmlFor="exampleInputText2" className="form-label">Marque</label>
                                <input type="text"
                                    className="form-control"
                                    id="exampleInputText2"
                                    aria-describedby="emailHelp"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="row m-0">
                            <div className="w-50  ">
                                <label htmlFor="exampleInputText3" className="form-label ">Type</label>
                                <input type="text"
                                    className="form-control"
                                    id="exampleInputText3"
                                    value={type}
                                    onChange={(e) => {
                                        setType(e.target.value);
                                    }} />
                            </div>
                            <div className="w-50  ">
                                <label htmlFor="exampleInputText4" className="form-label">Date De Entree</label>
                                <input type="date"
                                    className="form-control"
                                    id="exampleInputText4"
                                    value={DateFormat.convertToInputDateFormat(rowData.entryDate)}
                                    ref={entryDateRef}
                                    onChange={(e) => {
                                    }} />
                            </div>
                        </div>
                        <div className="mb-3  p-1 ">
                            <label htmlFor="exampleSelect" className="form-label">Client</label>
                            <input list="id_datalist0"
                                className="form-control"
                                value={client.dénominationSociale}
                                onChange={e => {
                                    const selected = listClient.find(client => client.dénominationSociale === e.target.value);
                                    if (selected)
                                        setClient(selected)
                                    else
                                        setClient(e.target.value)
                                }
                                }
                                placeholder="Enter Dénomination Sociale"
                                onKeyUp={handleSearch} />
                            <datalist id="id_datalist0" className="w-100  p-2 ">
                                {listClient
                                    .filter(client => client.dénominationSociale.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map(client => (
                                        <option key={client.id} value={client.dénominationSociale} />
                                    ))}
                            </datalist>
                        </div>
                        <div className="row m-0">
                            <div className="w-50 p-1 ">
                                <label htmlFor="exampleSelect" className="form-label">Technicien</label>
                                <input list="id_datalist1"
                                    value={technician != null && technician.username}
                                    className="form-control"
                                    onChange={e => {
                                        const selected = listTechnician.find(technicien => technicien.username === e.target.value);
                                        if (selected)
                                            setTechnician(selected)
                                        else if (e.target.value === "ALL")
                                            setTechnician({ id: -1 })
                                        else
                                            setTechnician(e.target.value)
                                    }
                                    }
                                    placeholder="Enter Username"
                                    onKeyUp={handleSearch} />
                                <datalist id="id_datalist1">
                                    <option value="ALL" />
                                    {listTechnician
                                        .filter(technicien => technicien.username.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map(technicien => (
                                            <option key={technicien.id} value={technicien.username} />
                                        ))}
                                </datalist>
                            </div>
                            <div className="w-50 p-1 ">
                                <label htmlFor="exampleSelect" className="form-label">Entree Par</label>
                                <input className="form-control"
                                    list="id_datalist2"
                                    value={entreeBy}
                                    placeholder="Enter Username"
                                    onChange={e => {
                                        setEntreeBy(e.target.value)
                                    }}
                                    onKeyUp={handleSearch} />
                                <datalist id="id_datalist2">
                                    {listTechnician
                                        .filter(technicien => technicien.username.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map(technicien => (
                                            <option key={technicien.id} value={technicien.username} />
                                        ))}
                                </datalist>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">Enregistrer</button>

                    </form>
                </div>
            </main>
        </>)
}