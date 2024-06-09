import * as React from 'react';
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Navigation from "../home/Navigation";
import {MakeRequest} from "../../services/MakeRequest";
import {FetchListService} from "../../services/FetchListService";
import Swal from "sweetalert2";

export const AddRole = () => {
    const [listPermission,setListPermission]=useState([])
    const [newRole,setNewRole]=useState('')
    const navigate =useNavigate()

    const [selectedPermissions, setSelectedPermissions] = useState([])

    useEffect(() => {
        fetchListPermissions()
    }, []);

    const handleSubmit =(event)=>{
        event.preventDefault()
        const roleData =  {
            roleName:newRole,
            permissions:selectedPermissions
        }

        MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/user/addRole`,'POST',roleData)
            .then(data => {
                if (data) {
                    navigate("/roles")
                    Swal.fire({
                        position: "top",
                        icon: "success",
                        title: "Your role has been added",
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
    }
    const handlePermissionSelectChange = (permission) => {
        if (selectedPermissions.includes(permission)) {
            setSelectedPermissions(selectedPermissions.filter(p => p.id !== permission.id));
        } else {
            setSelectedPermissions([...selectedPermissions, permission]);
        }
    };
    const fetchListPermissions=async () => {
        const data = await FetchListService.FetchListPermissions()
        setListPermission(data)
    }
    const handleReset = () => {
        setNewRole('')
        setSelectedPermissions([])
    }
    return (
        <main>
            <Navigation type="roles"/>
            <div className="card w-50">
                <h2 className="text-center text-dark">Ajouter Rôle</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputText1" className="form-label">Rôle</label>
                        <input type="text"
                               className="form-control"
                               id="exampleInputText1"
                               value={newRole}
                               onChange={(e) => {
                                   setNewRole(e.target.value)
                               }}
                               required/>
                    </div>
                    <div className="mb-3 ">
                        <label htmlFor="exampleInputText4"
                               className="form-label">Permissions</label>
                        <div className="row flex-wrap justify-content-around align-items-center p-0 m-0 "
                             style={{
                                 border: "1px solid #ced4da",
                                 borderRadius: "0.25rem",
                                 textShadow: "0 0 0 #495057",
                             }}>
                            {
                                listPermission.map((permission) => (
                                    <div key={permission.id} className="row m-1">
                                        <input
                                            type="checkbox"
                                            name="flexRadioDefault0"
                                            id={permission.id}
                                            checked={selectedPermissions.some(p => p.id === permission.id)}
                                            onChange={() => {
                                                handlePermissionSelectChange(permission)

                                            }
                                            }
                                        />
                                        <label htmlFor={permission.id}>{permission.name}</label>
                                    </div>
                                ))
                            }
                        </div>
                        {selectedPermissions.length < 1 && (
                            <p className="text-center" style={{color: 'red'}}>Veuillez sélectionner au moins une permission</p>
                        )}
                    </div>

                    <div className="row m-0 align-items-center">
                        {selectedPermissions.length > 0 && (
                            <button type="submit" className="rounded-pill h-50 w-50 btn-success">Ajouter</button>)}
                        <button type="reset" onClick={handleReset} className="btn w-50 btn-primary">Réset</button>
                    </div>
                </form>
            </div>
        </main>
    );
};