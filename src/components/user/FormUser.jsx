import { InputField, RadioField } from "../../services/FormService";
import { FetchListService } from "../../services/FetchListService";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";

const FormUser = ({ handleSend, title, showPasswordFields = true, togglePasswordFields, formData, setFormData }) => {
    const userData = jwtDecode(localStorage.getItem('token'));
    const [listRoles, setListRoles] = useState([]);

    const statusOptions = [
        { value: 'ACTIVE', label: 'Actif' },
        { value: 'INACTIVE', label: 'Inactif' }
    ]

    useEffect(() => {
        if (userData.role === 'ADMIN' || userData.role === 'MANAGER') {
            fetchListRoles();
        }
    }, [userData.role]);

    async function fetchListRoles() {
        const data = await FetchListService.FetchListRoles();
        if (!togglePasswordFields) {
            setFormData(prevFormData => ({
                ...prevFormData,
                roleSelected: data[2]
            }));
        }
        setListRoles(data);
    }
    const handleReset = () => {
        setFormData({
            firstName: '',
            lastName: '',
            username: '',
            status: 'ACTIVE',
            password: '',
            confirmPassword: '',
            roleSelected: {}
        });
    };
    const handleChange = (e) => {
        const { id, name, value } = e.target;
        setFormData({ ...formData, [name || id]: value });
    };
    return (
        <form onSubmit={handleSend} className="flex-column flex-wrap">
            <div className="row m-0 w-100 justify-content-between nowrap">
                <InputField
                    id="firstName"
                    label="Prénom"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
                <InputField
                    id="lastName"
                    label="Nom"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                />
            </div>
            <InputField
                id="username"
                label="Nom_Utilisateur"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
            />

            {togglePasswordFields && <button type="button" className="mb-2" onClick={togglePasswordFields}>Modifier_Mot_De_Passe</button>}

            {showPasswordFields && (
                <>
                    <div className="row m-0 w-100 justify-content-between nowrap">
                        <InputField
                            id="password"
                            label="Mot_De_Passe"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <InputField
                            id="confirmPassword"
                            label="Confirmer_Mot_De_Passe"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </>)}
            {(userData.role === 'ADMIN' || userData.role === 'MANAGER') && (
                <>
                    <RadioField
                        name="roleSelected"
                        label="Rôle"
                        options={listRoles.map(role => ({
                            value: JSON.stringify(role),
                            label: role.roleName
                        }))}
                        selectedValue={JSON.stringify(formData.roleSelected)}
                        onChange={e => setFormData(prevFormData => ({
                            ...prevFormData,
                            roleSelected: JSON.parse(e.target.value)
                        }))}
                    />

                </>
            )}
            <RadioField
                name="status"
                label="État"
                options={statusOptions}
                selectedValue={formData.status}
                onChange={handleChange}
            />
            <div className="row m-0 align-items-center">
                <button type="submit" className="rounded-pill w-50 h-50 btn-success">{title}</button>
                <button type="reset" onClick={handleReset} className="btn w-50 btn-primary">Réset</button>
            </div>
        </form>
    )
}
export default FormUser;