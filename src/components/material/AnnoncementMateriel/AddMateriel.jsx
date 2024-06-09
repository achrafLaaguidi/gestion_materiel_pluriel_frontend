import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../../home/Navigation";
import { jwtDecode } from "jwt-decode";
import { FetchListService } from "../../../services/FetchListService";
import { MakeRequest } from "../../../services/MakeRequest";
import { ImportExcel } from "../../../services/ImportExcel";
import { DateFormat } from "../../../services/DateFormat";
import Swal from "sweetalert2";



export default function AddMateriel() {
    const userData = jwtDecode((localStorage.getItem('token')))
    const [seriesNumber, setSeriesNumber] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
    const [entreeBy, setEntreeBy] = useState('');
    const [technician, setTechnician] = useState()
    const [client, setClient] = useState();
    const navigate = useNavigate()
    const [listClient, setListClient] = useState([])
    const [listTechnician, setListTechnician] = useState([])
    const isAdminOrManager = userData.role === 'ADMIN' || userData.role === 'MANAGER';

    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        fetchListClient()
        fetchListTechnician()
    }, []);


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

    useEffect(() => {
        if (listClient.length > 0) {
            setClient(listClient[0]);
        }
    }, [listClient]);
    useEffect(() => {
        if (listTechnician.length > 0) {
            setEntreeBy(isAdminOrManager ? listTechnician[0]?.username : '');
        }
    }, [listTechnician, isAdminOrManager]);



    function handleAdd(event) {
        event.preventDefault()
        const materielData = {
            seriesNumber: seriesNumber,
            name: name,
            type: type,
            client: client,
            entreeBy: entreeBy === '' ? userData.sub : entreeBy,
            technician: technician,
            entryDate: DateFormat.formatFrenchDate(entryDate)
        }
        MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/material/addMaterielRepair`,
            'POST',
            materielData)
            .then(data => {
                if (data) {
                    if (userData.permissions.includes('view_materials')) {
                        navigate("/materielsAnnoncee")
                        Swal.fire({
                            position: "top",
                            icon: "success",
                            title: "This material " + materielData.name + " has been added",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                    else {
                        navigate("/Home")
                        Swal.fire({
                            position: "top",
                            icon: "success",
                            title: "This material " + materielData.name + " has been added",
                            showConfirmButton: false,
                            timer: 1000
                        });
                    }
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
    }


    function handleReset(event) {
        event.preventDefault()
        setName('')
        setSeriesNumber('')
        setClient(listClient[0])
        setType('')
        setEntreeBy('')
        setTechnician(listTechnician[0])
        setEntryDate(new Date().toISOString().split('T')[0])
    }
    return (
        <>
            <main>
                <Navigation type="materiels" />
                <div className="card w-75">
                    <div className="row justify-content-between m-0">

                        <h2 className="text-center text-dark">
                            Ajouter Matériel à Réparer
                        </h2>
                        <ImportExcel
                            navigate={navigate}
                            type="materiel"
                            userData={userData} />
                    </div>
                    <form onReset={handleReset} onSubmit={handleAdd} className="flex-column flex-wrap">
                        <div className="row m-0">
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
                            <div className="w-50  ">
                                <label htmlFor="exampleInputText1" className="form-label">Numéro De Serie</label>
                                <input type="text"
                                    className="form-control"
                                    id="exampleInputText1"
                                    value={seriesNumber}
                                    onChange={(e) => {
                                        setSeriesNumber(e.target.value);
                                    }}
                                    required
                                />
                            </div>
                        </div>
                        <div className="row m-0">
                            <div className="w-50 ">
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
                                    value={entryDate}
                                    onChange={(e) => {
                                        setEntryDate(e.target.value)
                                    }} />
                            </div>
                        </div>
                        <div className="mb-3  p-1 ">
                            <label htmlFor="exampleSelect" className="form-label">Client</label>
                            <input list="id_datalist0"
                                className="form-control"
                                onChange={e => {
                                    const selected = listClient.find(client => client.dénominationSociale === e.target.value);
                                    if (selected)
                                        setClient(selected)
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
                        <div className="row m-0 ">
                            {isAdminOrManager &&
                                <div className="w-50  p-1 ">
                                    <label htmlFor="exampleSelect" className="form-label">Technicien</label>
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
                                </div>}
                            {isAdminOrManager && (
                                <div className="w-50 p-1 ">
                                    <label htmlFor="exampleSelect" className="form-label">Entree Par</label>
                                    <input className="form-control"
                                        list="id_datalist2"
                                        placeholder="Enter Username"
                                        onChange={e => { setEntreeBy(e.target.value) }}
                                        onKeyUp={handleSearch} />
                                    <datalist id="id_datalist2"  >
                                        {listTechnician
                                            .filter(technicien => technicien.username.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map(technicien => (
                                                <option key={technicien.id} value={technicien.username} />
                                            ))}
                                    </datalist>
                                </div>
                            )}

                        </div>
                        <div className="row m-0 w-auto align-items-center ">
                            <button type="submit" className="rounded-pill w-50 h-50 btn-success">Ajouter</button>
                            <button type="reset" className="btn w-50 btn-dark">Réset</button>
                        </div>
                    </form>
                </div>
            </main>

        </>
    )
}