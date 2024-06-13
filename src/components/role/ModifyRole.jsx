import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "../home/Navigation";
import { MakeRequest } from "../../services/MakeRequest";
import Swal from "sweetalert2";
import FormRole from './FormRole';

export const ModifyRole = () => {
    const location = useLocation();
    const rowData = location.state.data;
    const [listPermission, setListPermission] = useState([]);
    const [roleData, setRoleData] = useState({
        roleId: rowData.roleId,
        roleName: rowData.roleName,
        permissions: rowData.permissions
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchListPermissions();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        }).then((result) => {
            if (result.isConfirmed) {
                MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/user/modifyRole`, 'PUT', roleData)
                    .then(data => {
                        if (data) {
                            navigate("/roles");
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
                navigate("/roles");
                Swal.fire("Changes are not saved", "", "info");
            }
        });
    };

    const handlePermissionSelectChange = (permission) => {
        setRoleData(prevRoleData => {
            const permissions = prevRoleData.permissions.includes(permission)
                ? prevRoleData.permissions.filter(p => p.id !== permission.id)
                : [...prevRoleData.permissions, permission];
            return { ...prevRoleData, permissions };
        });
    };

    const fetchListPermissions = () => {
        MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/user/listPermissions`, 'GET')
            .then(data => {
                if (data) {
                    setListPermission(data);
                }
            })
            .catch(error => {
                console.error('Error :', error);
            });
    };

    const handleReset = () => {
        setRoleData({
            roleId: rowData.roleId,
            roleName: '',
            permissions: []
        });
    };

    return (
        <main>
            <Navigation type="roles" />
            <div className="card w-50">
                <h2 className="text-center text-dark">Modifier Rôle</h2>
                <FormRole
                    handleSend={handleSubmit}
                    handleReset={handleReset}
                    title="Enregistrer"
                    handlePermissionSelectChange={handlePermissionSelectChange}
                    roleData={roleData} setRoleData={setRoleData}
                    listPermission={listPermission} />
            </div>
        </main>
    );
};
