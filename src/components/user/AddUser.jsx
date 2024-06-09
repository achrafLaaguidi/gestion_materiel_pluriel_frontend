import React, {useEffect, useState} from "react";
import '../../style.css';
import '../home/home.css';
import Navigation from "../home/Navigation";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {FetchListService} from "../../services/FetchListService";
import {MakeRequest} from "../../services/MakeRequest";
import Swal from "sweetalert2";
export default function AddUser() {
    const userData=jwtDecode(localStorage.getItem('token'))
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [status, setStatus] = useState('ACTIVE')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [roleSelected,setRoleSelected]=useState({})
    const [listRoles,setListRoles]=useState([])
    const navigate=useNavigate()


    useEffect(() => {
       if(userData.role==='ADMIN' || userData.role==='MANAGER') {
           fetchListRoles()
       }
    }, [userData.role]);


async function fetchListRoles() {
    const data = await FetchListService.FetchListRoles()
    setRoleSelected(data[2])
    setListRoles(data)
}


    const handleAdd = (event) => {

        event.preventDefault();
        const userData = {
            firstName:firstName,
            lastName:lastName,
            username: username,
            password: password,
            status:status,
        role:roleSelected}
        if (password !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Password is incorrect",
            });
        } else {
            MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/user/addUser`,'POST',userData)
                .then(data => {
                    if (data) {
                        navigate("/users")
                        Swal.fire({
                            position: "top",
                            icon: "success",
                            title: "This user "+userData.username +" has been added",
                            showConfirmButton: false,
                            timer: 1000
                        });
                    }
                })
                .catch(error => {
                    console.error('Error :', error)
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: error.message,
                    });
                })
        }
    }

    function handleReset() {
        setUsername('')
        setPassword('')
        setConfirmPassword('')
        setStatus('ACTIVE')
        setRoleSelected({})
        setFirstName('')
        setLastName('')
    }


    return (  <>
        <main>
            <Navigation type="users"/>
                <div className="card w-75">
                    <h2 className="text-center text-dark">Ajouter Utilisateur</h2>
                    <form onSubmit={handleAdd} className="flex-column flex-wrap">
                        <div className=" row m-0 ">
                            <div className="mb-3 w-50 ">
                                <label htmlFor="exampleInputText1" className="form-label">Prénom</label>
                                <input type="text"
                                       className="form-control"
                                       id="exampleInputText1"
                                       aria-describedby="emailHelp"
                                       value={firstName}
                                       onChange={(e) => {
                                           setFirstName(e.target.value)
                                       }}
                                       required/>
                            </div>
                            <div className="mb-3 w-50 ">
                                <label htmlFor="exampleInputText2" className="form-label">Nom</label>
                                <input type="text"
                                       className="form-control"
                                       id="exampleInputText2"
                                       aria-describedby="emailHelp"
                                       value={lastName}
                                       onChange={(e) => {
                                           setLastName(e.target.value)
                                       }}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputText3" className="form-label">Nom_Utilisateur</label>
                            <input type="text"
                                   className="form-control"
                                   id="exampleInputText3"
                                   aria-describedby="emailHelp"
                                   value={username}
                                   onChange={(e) => {
                                       setUsername(e.target.value)
                                   }}
                                   required/>
                        </div>
                        <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Mot_De_Passe</label>
                            <input type="password"
                                   className="form-control"
                                   id="exampleInputPassword1"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword2" className="form-label">Confirmer_Mot_De_Passe</label>
                            <input type="password"
                                   className="form-control"
                                   id="exampleInputPassword2"
                                   value={confirmPassword}
                                   onChange={(e) => setConfirmPassword(e.target.value)}
                                   required
                            />
                        </div>
                        {(userData.role === 'ADMIN' || userData.role === 'MANAGER') &&
                            <>
                                <div className="mb-3">
                                    <div className="m-0 row flex-nowrap justify-content-between">
                                        <label htmlFor="exampleInputText4" className="form-label">Rôle</label>
                                        {userData.permissions.includes('add_role')&&
                                            <div className="btn btn-success rounded-5 m-0 border-success" onClick={() => navigate("/addRole")}>
                                                <i className="fa-solid fa-plus"></i>
                                        </div>}
                                    </div>
                                    {listRoles.map((role) => (
                                        <div className="form-check  mr-5" key={role.roleId}>
                                            <input className="form-check-input"
                                                   type="radio"
                                                   name="flexRadioDefault0"
                                                   id={`flexRadioDefault${role.roleId}`}
                                                   value={JSON.stringify(role)}
                                                   checked={roleSelected.roleId === role.roleId}
                                                   onChange={e => {
                                                       setRoleSelected(JSON.parse(e.target.value))
                                                   }
                                                   }
                                            />
                                            <label className="form-check-label"
                                                   htmlFor={`flexRadioDefault${role.roleId}`}>
                                                {role.roleName}
                                            </label>
                                        </div>))}
                                </div>
                            </>
                        }
                        <div className="custom-radio m-1">
                            <label htmlFor="flexRadioDefaulttwo">État</label>
                            <div className="form-check  mr-5">
                                <input className="form-check-input"
                                       type="radio"
                                       name="flexRadioDefault"
                                       id="flexRadioDefault120"
                                       value="ACTIVE"
                                       checked={status === 'ACTIVE'}
                                       onChange={e => setStatus(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                    Active
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault"
                                       id="flexRadioDefault100"
                                       value="INACTIVE"
                                       checked={status === 'INACTIVE'}
                                       onChange={e => setStatus(e.target.value)}/>
                                <label className="form-check-label" htmlFor="flexRadioDefault2">
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