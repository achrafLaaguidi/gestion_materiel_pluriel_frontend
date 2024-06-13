import * as React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../home/Navigation";
import { MakeRequest } from "../../services/MakeRequest";
import { FetchListService } from "../../services/FetchListService";
import Swal from "sweetalert2";
import FormRole from './FormRole';

export const AddRole = () => {
    const [listPermission, setListPermission] = useState([]);
    const [roleData, setRoleData] = useState({
        roleName: '',
        permissions: []
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchListPermissions();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/user/addRole`, 'POST', roleData)
            .then(data => {
                if (data) {
                    navigate("/roles");
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
    };

    const handlePermissionSelectChange = (permission) => {
        setRoleData(prevRoleData => {
            const permissions = prevRoleData.permissions.includes(permission)
                ? prevRoleData.permissions.filter(p => p.id !== permission.id)
                : [...prevRoleData.permissions, permission];
            return { ...prevRoleData, permissions };
        });
    };

    const fetchListPermissions = async () => {
        const data = await FetchListService.FetchListPermissions();
        setListPermission(data);
    };

    const handleReset = () => {
        setRoleData({
            roleName: '',
            permissions: []
        });
    };

    return (
        <main>
            <Navigation type="roles" />
            <div className="card w-50">
                <h2 className="text-center text-dark">Ajouter Rôle</h2>
                <FormRole handleSend={handleSubmit} handleReset={handleReset} title="Ajouter" handlePermissionSelectChange={handlePermissionSelectChange} roleData={roleData} setRoleData={setRoleData} listPermission={listPermission} />
            </div>
        </main>
    );
};
