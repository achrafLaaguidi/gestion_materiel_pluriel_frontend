// @flow
import * as React from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import Navigation from "../home/Navigation";
import {MakeRequest} from "../../services/MakeRequest";
import Swal from "sweetalert2";


export function AddContract() {

    const {id}= useParams();
    const navigate=useNavigate()
    const [code, setCode] = useState('');
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('ACTIVE')

    function handleAdd(event) {

        event.preventDefault();

        const contractData = {
            codeContract:code,
            title:title,
            status:status};

        MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/contract/addContract/${id}`,
            'POST',
            contractData)
            .then(data => {
                if (data) {
                    navigate("/clients")
                    Swal.fire({
                        position: "top",
                        icon: "success",
                        title: "This contract "+contractData.codeContract+" has been added",
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
            })
        }

    function handleReset() {
        setTitle('')
        setStatus('ACTIVE')
        setCode('')
    }

    return (
        <>
            <main>
            <Navigation type="clients"/>
            <div className="card w-75">
                <h2 className="text-center text-dark">Ajouter Contrat</h2>
                <form onSubmit={handleAdd} className="flex-column flex-wrap">
                    <div className=" row m-0 ">
                        <div className="mb-3 w-100">
                            <label htmlFor="exampleInputText1" className="form-label">Code_De_Contrat</label>
                            <input type="text"
                                   className="form-control"
                                   id="exampleInputText1"
                                   aria-describedby="emailHelp"
                                   value={code}
                                   onChange={(e) => {
                                       setCode(e.target.value);
                                   }}
                                   required/>
                        </div>
                    </div>
                    <div className="custom-radio m-3 ">
                        <label htmlFor="flexRadioDefault" >Titre</label>
                        <div className="form-check ">
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
                    <div className="row m-0 align-items-center ">
                        <button type="submit" className="rounded-pill w-50 h-50 btn-success">Ajouter</button>
                        <button type="reset" onClick={handleReset} className="btn w-50 btn-primary">Réset</button>
                    </div>
                </form>
            </div>
            </main>
        </>)
}