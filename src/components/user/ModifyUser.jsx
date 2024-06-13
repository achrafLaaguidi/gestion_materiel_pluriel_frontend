import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "../home/Navigation";
import React, { useState } from "react";
import { MakeRequest } from "../../services/MakeRequest";
import Swal from "sweetalert2";
import FormUser from "./FormUser";


export default function ModifyUser() {
    const location = useLocation();
    const rowData = location.state.row;
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [formData, setFormData] = useState({
        firstName: rowData.firstName,
        lastName: rowData.lastName,
        username: rowData.username,
        status: rowData.status,
        password: '',
        confirmPassword: '',
        roleSelected: rowData.role
    });
    const navigate = useNavigate();


    const togglePasswordFields = () => {
        setShowPasswordFields(!showPasswordFields);
    };

    const handleModify = (event) => {
        event.preventDefault();

        const userData = {
            id: rowData.id,
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
            password: formData.password,
            status: formData.status,
            role: formData.roleSelected
        };

        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Password is incorrect",
            });
        } else {
            Swal.fire({
                title: "Do you want to save the changes?",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Save",
                denyButtonText: `Don't save`
            }).then((result) => {
                if (result.isConfirmed) {
                    MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/user/modifyUser`, 'PUT', userData)
                        .then(data => {
                            if (data) {
                                navigate("/users");
                                Swal.fire({
                                    position: "top",
                                    icon: "success",
                                    title: `This user ${formData.username} has been saved`,
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
                    navigate("/users");
                    Swal.fire("Changes are not saved", "", "info");
                }
            });
        }
    };


    return (
        <main>
            <Navigation type="users" />
            <div className="card w-75">
                <h2 className="text-center text-dark">Modifier Utilisateur</h2>
                <FormUser
                    handleSend={handleModify}
                    title="Enregistrer"
                    setFormData={setFormData}
                    formData={formData}
                    showPasswordFields={showPasswordFields}
                    togglePasswordFields={togglePasswordFields}
                />
            </div>
        </main>
    );
}
