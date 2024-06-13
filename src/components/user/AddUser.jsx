import React, { useState } from "react";
import '../../style.css';
import '../home/home.css';
import Navigation from "../home/Navigation";
import { useNavigate } from "react-router-dom";
import { MakeRequest } from "../../services/MakeRequest";
import Swal from "sweetalert2";
import FormUser from "./FormUser";

export default function AddUser() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        status: 'ACTIVE',
        password: '',
        confirmPassword: '',
        roleSelected: {}
    });
    const navigate = useNavigate();



    const handleAdd = (event) => {
        event.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Password is incorrect",
            });
        } else {
            const { firstName, lastName, username, password, status, roleSelected } = formData;
            const userData = { firstName, lastName, username, password, status, role: roleSelected };
            MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/user/addUser`, 'POST', userData)
                .then(data => {
                    if (data) {
                        navigate("/users");
                        Swal.fire({
                            position: "top",
                            icon: "success",
                            title: `This user ${formData.username} has been added`,
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
    };





    return (
        <main>
            <Navigation type="users" />
            <div className="card w-75">
                <h2 className="text-center text-dark">Ajouter Utilisateur</h2>
                <FormUser
                    handleSend={handleAdd}
                    title="Ajouter"
                    setFormData={setFormData}
                    formData={formData} />
            </div>
        </main>
    );
}
