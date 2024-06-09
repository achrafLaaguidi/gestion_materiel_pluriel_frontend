import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Navigation from "../../home/Navigation";
import {FetchListService} from "../../../services/FetchListService";
import {MakeRequest} from "../../../services/MakeRequest";
import {DateFormat} from "../../../services/DateFormat";
import Swal from "sweetalert2";


export default function ModifyMaterialRepairByAll(){
    const location = useLocation();
    const rowData =location.state.data;

    const [seriesNumber, setSeriesNumber] = useState(rowData.seriesNumber);
    const [name, setName] = useState(rowData.name);
    const [type, setType] = useState(rowData.type);
    const [client, setClient] = useState({});
    const [entreeBy, setEntreeBy] = useState(rowData.entreeBy);
    const [technician,setTechnician]=useState({})
    const [entryDate, setEntryDate] = useState(DateFormat.convertToInputDateFormat(rowData.entryDate));
    const [releaseDate, setReleaseDate] = useState(DateFormat.convertToInputDateFormat(rowData.releaseDate));
    const [isGarented, setIsGarented] = useState(rowData.isGarented);
    const [intervention, setIntervention] = useState(rowData.intervention);
    const [dureeIntervention, setDureeIntervention] = useState(rowData.dureeIntervention);
    const navigate=useNavigate()

    const [listClient,setListClient]=useState([])
    const [listTechnician, setListTechnician] = useState([])

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
        const dataRecus = await FetchListService.FetchListClient()
        setListClient(dataRecus)
    }
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

    const handleModify = (event) => {
        event.preventDefault();

        const materielData = {
            id:rowData.id,
            seriesNumber:seriesNumber,
            name:name,
            type:type,
            isGarented:isGarented,
            client:client,
            technician:technician,
            entreeBy: entreeBy,
            entryDate:DateFormat.formatFrenchDate(entryDate),
            releaseDate:DateFormat.formatFrenchDate(releaseDate),
            dureeIntervention:dureeIntervention,
            intervention:intervention,
        }
        Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        }).then((result) => {
            if (result.isConfirmed) {
                MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/material/modifyMaterialRepair`
                    ,'PUT',
                    materielData)
                    .then(data => {
                        if (data) {
                            navigate(-1)
                            Swal.fire({
                                position: "top",
                                icon: "success",
                                title: "This Material "+materielData.name+" has been saved",
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
                navigate(-1)
                Swal.fire("Changes are not saved", "", "info");
            }
        });
    }

        return(
            <>
                <main>
                    <Navigation type="materielsReparées" />
                    <div className="card w-75">
                        <h2 className="text-center text-dark">Modifier Materiel  [{rowData.seriesNumber}]</h2>
                        <form onSubmit={handleModify} className="flex-column flex-wrap">
                            <div className=" row m-0 ">
                                <div className="mb-3 w-50 ">
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
                                <div className="mb-3 w-50 ">
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
                            </div>
                            <div className=" row m-0 ">
                                <div className="mb-3  w-50">
                                    <label htmlFor="exampleInputText3" className="form-label ">Type</label>
                                    <input type="text"
                                           className="form-control"
                                           id="exampleInputText3"
                                           value={type}
                                           onChange={(e) => {
                                               setType(e.target.value);
                                           }}/>
                                </div>
                                <div className="mb-3  w-50">
                                    <label htmlFor="flexRadioDefault" className="form-label ">Garentie?</label>
                                    <div
                                        className="custom-radio   form-control  p-1 align-items-center justify-content-center ">
                                        <div className="form-check  mr-3 w-25">
                                            <input className="form-check-input"
                                                   type="radio"
                                                   name="flexRadioDefault"
                                                   id="flexRadioDefault1"
                                                   value={true}
                                                   checked={isGarented === true}
                                                   onChange={e => setIsGarented(true)}
                                            />
                                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                OUI
                                            </label>
                                        </div>
                                        <div className="form-check w-25">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault"
                                                   id="flexRadioDefault2"
                                                   value={false}
                                                   checked={isGarented === false}
                                                   onChange={e => setIsGarented(false)}/>
                                            <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                NON
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3  row m-0  ">
                                <div className="mb-3 w-50 p-1 ">
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
                                           onKeyUp={handleSearch}/>
                                    <datalist id="id_datalist0" className="w-100  p-2 ">
                                        {listClient
                                            .filter(client => client.dénominationSociale.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map(client => (
                                                <option key={client.id} value={client.dénominationSociale}/>
                                            ))}
                                    </datalist>
                                </div>
                                <div className="mb-3  p-1 w-25 ">
                                    <label htmlFor="exampleSelect" className="form-label">Technicien</label>
                                    <input list="id_datalist1"
                                           value={technician != null && technician.username}
                                           className="form-control"
                                           onChange={e => {
                                               const selected = listTechnician.find(technicien => technicien.username === e.target.value);
                                               if (selected)
                                                   setTechnician(selected)
                                               else if (e.target.value === "ALL")
                                                   setTechnician({id: -1})
                                               else
                                                   setTechnician(e.target.value)
                                           }
                                           }
                                           placeholder="Enter Username"
                                           onKeyUp={handleSearch}/>
                                    <datalist id="id_datalist1">
                                        <option value="ALL"/>
                                        {listTechnician
                                            .filter(technicien => technicien.username.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map(technicien => (
                                                <option key={technicien.id} value={technicien.username}/>
                                            ))}
                                    </datalist>
                                </div>
                                <div className="mb-3  p-1 w-25">
                                    <label htmlFor="exampleSelect" className="form-label">Entree Par</label>
                                    <input className="form-control"
                                           list="id_datalist2"
                                           value={entreeBy}
                                           placeholder="Enter Username"
                                           onChange={e => {
                                               setEntreeBy(e.target.value)
                                           }}
                                           onKeyUp={handleSearch}/>
                                    <datalist id="id_datalist2">
                                        {listTechnician
                                            .filter(technicien => technicien.username.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map(technicien => (
                                                <option key={technicien.id} value={technicien.username}/>
                                            ))}
                                    </datalist>
                                </div>
                                <div className="mb-3 w-50 ">
                                    <label htmlFor="exampleInputText4" className="form-label">Date De Entree</label>
                                    <input type="date"
                                           className="form-control"
                                           id="exampleInputText4"
                                           value={entryDate}
                                           onChange={(e) => {
                                               setEntryDate(e.target.value);
                                           }}/>
                                </div>
                                <div className="mb-3 w-50 ">
                                    <label htmlFor="exampleInputText6" className="form-label">Date De Sortie</label>
                                    <input type="date"
                                           className="form-control"
                                           id="exampleInputText6"
                                           value={releaseDate}
                                           onChange={(e) => {
                                               setReleaseDate(e.target.value);
                                           }}/>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputText5" className="form-label">Duree d'intervention</label>
                                <input type="text"
                                       className="form-control"
                                       id="exampleInputText5"
                                       value={dureeIntervention}
                                       onChange={(e) => {
                                           setDureeIntervention(e.target.value);
                                       }}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputText6" className="form-label">Intervention</label>
                                <textarea className="form-control"
                                          rows={10}
                                          value={intervention}
                                          id="exampleInputText6"
                                          onChange={(e) => {
                                              setIntervention(e.target.value);
                                          }}/>
                            </div>
                            <button type="submit" className="btn btn-primary">Enregistrer</button>

                        </form>
                    </div>
                </main>
            </>
        )
}