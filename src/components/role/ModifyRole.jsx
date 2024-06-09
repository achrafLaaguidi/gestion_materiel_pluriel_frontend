import * as React from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Navigation from "../home/Navigation";
import {MakeRequest} from "../../services/MakeRequest";
import Swal from "sweetalert2";

export const ModifyRole = () => {
    const location=useLocation()
    const rowData=location.state.data
    const [listPermission,setListPermission]=useState([])
    const [newRole,setNewRole]=useState(rowData.roleName)
    const navigate =useNavigate()


    const [selectedPermissions, setSelectedPermissions] = useState(rowData.permissions)

    useEffect(() => {
        fetchListPermissions()
    }, []);

    const handleSubmit =(event)=>{
        event.preventDefault()
        const roleData =  {
            roleId:rowData.roleId,
            roleName:newRole,
            permissions:selectedPermissions
        }
        Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        }).then((result) => {
            if (result.isConfirmed) {
                MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/user/modifyRole`
                    ,'PUT',roleData)
                    .then(data => {
                        if (data) {
                            navigate("/roles")
                            Swal.fire({
                                position: "top",
                                icon: "success",
                                title: "Your role has been saved",
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
                navigate("/roles")
                Swal.fire("Changes are not saved", "", "info");
            }
        });


    }
    const handlePermissionSelectChange = (permission) => {
        if (selectedPermissions.includes(permission)) {
            setSelectedPermissions(selectedPermissions.filter(p => p.id !== permission.id));
        } else {
            setSelectedPermissions([...selectedPermissions, permission]);
        }
    };
    const fetchListPermissions=()=>{
        MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/user/listPermissions`,'GET')
            .then(data => {
                if (data) {
                    setListPermission(data)
                }
            })
            .catch(error => {
                console.error('Error :', error);
            });
    }
    const handleReset = () => {
        setNewRole('')
        setSelectedPermissions([])
    }
    return (
        <main>
            <Navigation type="roles"/>
            <div className="card w-50">
                <h2 className="text-center text-dark">Modifier Rôle</h2>
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
                            {selectedPermissions.length<1 && (
                                <p style={{ color: 'red' }}>Veuillez sélectionner au moins une permission</p>
                            )}
                        </div>
                    </div>

                    {selectedPermissions.length>0 && (<button type="submit" className="btn btn-primary">Enregistrer</button>)}
                    <button type="reset" onClick={handleReset} className="btn btn-primary">Réset</button>
                </form>
            </div>
        </main>
    )
}