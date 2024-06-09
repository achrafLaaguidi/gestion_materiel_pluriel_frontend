import * as React from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useState} from "react";
import Navigation from "../home/Navigation";
import {MakeRequest} from "../../services/MakeRequest";
import Swal from "sweetalert2";


export function ModifyContract() {

    const location = useLocation();
    const rowData =location.state.row;
    const navigate=useNavigate()
    const [codeContract, setCodeContract] = useState(rowData.codeContract);
    const [title, setTitle] = useState(rowData.title);
    const [status, setStatus] = useState(rowData.status)

    function handleModify(event) {

        event.preventDefault();

        const contractData = {
            id:rowData.id,
            codeContract:codeContract,
            title:title,
            status:status}

        Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        }).then((result) => {
            if (result.isConfirmed) {
                MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/contract/modifyContract`
                    ,'PUT',contractData)
                    .then(data => {
                        if (data) {
                            navigate(-1)
                            Swal.fire({
                                position: "top",
                                icon: "success",
                                title: "This contract "+contractData.codeContract+" has been saved",
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

    return (
        <>
            <main>
                <Navigation type="contracts"/>
            <div className="card w-75">
                <h2 className="text-center text-dark">Modifier Contrat</h2>
                <form onSubmit={handleModify} className="flex-column flex-wrap">
                    <div className=" row m-0 ">
                        <div className="mb-3 w-100">
                            <label htmlFor="exampleInputText1" className="form-label">Code_De_Contrat</label>
                            <input type="text"
                                   className="form-control"
                                   id="exampleInputText1"
                                   value={codeContract}
                                   onChange={(e) => {
                                       setCodeContract(e.target.value);
                                   }}
                                   required/>
                        </div>
                    </div>
                    <div className="custom-radio m-3">
                        <label htmlFor="flexRadioDefault">Titre</label>
                        <div className="form-check  mr-5">
                            <input className="form-check-input"
                                   type="radio"
                                   name="flexRadioDefault"
                                   id="flexRadioDefault1"
                                   value="Main_Ouevre"
                                   checked={title === 'Main_Ouevre'}
                                   onChange={e => setTitle(e.target.value)}
                            />
                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                Main d'Ouevre
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault"
                                   id="flexRadioDefault2"
                                   value="Piece_Main_Ouevre"
                                   checked={title === 'Piece_Main_Ouevre'}
                                   onChange={e => setTitle(e.target.value)}/>
                            <label className="form-check-label" htmlFor="flexRadioDefault2">
                                Piece et Main d'Ouevre
                            </label>
                        </div>
                    </div>
                    <div className="custom-radio m-3">
                        <label htmlFor="flexRadioDefaulttwo">État</label>
                        <div className="form-check  mr-5">
                            <input className="form-check-input"
                                   type="radio"
                                   name="flexRadioDefaulttwo"
                                   id="flexRadioDefault3"
                                   value="ACTIVE"
                                   checked={status === 'ACTIVE'}
                                   onChange={e => setStatus(e.target.value)}
                            />
                            <label className="form-check-label" htmlFor="flexRadioDefault3">
                                Active
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefaulttwo"
                                   id="flexRadioDefault4"
                                   value="INACTIVE"
                                   checked={status === 'INACTIVE'}
                                   onChange={e => setStatus(e.target.value)}/>
                            <label className="form-check-label" htmlFor="flexRadioDefault4">
                                Inactive
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Enregistrer</button>

                </form>
            </div>
            </main>
        </>)
}