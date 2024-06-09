import React, { useState } from "react";
import './home.css'
import '../../style.css'
import { Link, useNavigate } from "react-router-dom";
import { loginService } from "../../services/loginService";
import { jwtDecode } from "jwt-decode";
export default function Navigation(props) {
    const navigate = useNavigate()
    const userData = jwtDecode((localStorage.getItem('token')))


    const [subMenuOpen, setSubMenuOpen] = useState({});
    const handleSubMenuClick = (navItem) => {
        setSubMenuOpen(prevState => ({
            ...prevState,
            [navItem]: !prevState[navItem]
        }));
    };
    const [showLogoutButton, setShowLogoutButton] = useState(false);

    const handleUsernameClick = () => {
        setShowLogoutButton(!showLogoutButton);
    };

    return (
        <>

            <nav className="main-menu">
                <div className="nav-menu ">
                    <div onClick={() => handleUsernameClick()} className="row align-items-center"
                         style={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap'}}>
                        {showLogoutButton && (
                            <button
                                className="btn btn-dark w-auto"
                                onClick={() => {
                                    loginService.logout();
                                    navigate("/login");
                                }}
                                style={{
                                    marginRight: '5px'
                                }}
                            >
                                <i
                                    className="fa fa-right-from-bracket nav-icon w-auto"
                                ></i>
                            </button>
                        )}
                        <button
                            className="btn btn-outline-light mb-1 mt-0"
                            style={{
                                fontSize: "1.2rem"
                            }}
                        >
                            {userData.sub}
                        </button>
                    </div>

                    <ul>
                        <li className={`nav-item`}
                            onClick={(e) => {
                                navigate("/Home")

                            }}>
                            <b></b>
                            <b></b>
                            <div className={`nav-div nav-item ${window.location.pathname === "/Home" && "active"}`}>
                                <i className="fa fa-house nav-icon "></i>
                                <span className="nav-text">Accueil</span>
                            </div>
                        </li>

                        <li className={`nav-item `} >
                            <b></b>
                            <b></b>
                            <div className={`nav-div nav-item ${(
                                window.location.pathname === "/AddMateriel"
                                || window.location.pathname === "/materielsAreparer"
                                || window.location.pathname === "/MaterielsRepareesByAll"
                                || window.location.pathname === "/materielsAnnoncee"
                                || window.location.pathname === "/historyUsers")
                            && "active"}`}
                                 onClick={() => handleSubMenuClick("materiels")}>
                                <i className="fa-solid fa-boxes-stacked nav-icon"></i>
                                <span className="nav-text">Materiels</span>
                                <svg aria-hidden="true" focusable="false" role="img"
                                     className="octicon octicon-triangle-down" viewBox="0 0 16 16"
                                     width="18" height="18" fill="currentColor"
                                     style={{
                                         display: "inline-block",
                                         userSelect: "none",
                                         verticalAlign: "text-bottom",
                                         overflow: "visible"
                                     }}>
                                    {subMenuOpen["materiels"] ?
                                        <path
                                            d="M4.427 8.573L7.823 5.177a.25.25 0 0 1 .354 0l3.396 3.396a.25.25 0 0 1-.177.427H4.604a.25.25 0 0 1-.177-.427z">
                                        </path>
                                        :
                                        <path
                                            d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z">
                                        </path>
                                    }

                                </svg>
                            </div>
                            {subMenuOpen["materiels"] && <ul>
                                <li>
                                    <Link to="/AddMateriel" style={{fontSize: '12px'}}>
                                        <i className="fa-solid fa-plus nav-icon w-0"
                                           style={{fontSize: '10px'}}></i>
                                        <span className="nav-text">Ajouter Materiel</span>
                                    </Link>
                                </li>
                                {userData.permissions.includes('add_annonce') &&
                                    <li >
                                        <Link to="/materielsAnnoncee" style={{fontSize: '12px'}}>
                                            <i className="fa-solid fa-table-list nav-icon w-0"
                                               style={{fontSize: '10px'}}></i>
                                            <span className="nav-text">Annonces</span>
                                        </Link>
                                    </li>}
                                {userData.permissions.includes('view_materials') &&
                                    <ul>
                                        <li >
                                            <Link to="/MaterielsRepareesByAll" style={{fontSize: '12px'}}>
                                                <i className="fa-solid fa-table-list nav-icon w-0"
                                                   style={{fontSize: '10px'}}></i>
                                                <span className="nav-text">Materiels En Attente</span>
                                            </Link>
                                        </li>
                                        <li >
                                            <Link to="/historyUsers" style={{fontSize: '12px'}}>
                                                <i className="fa-solid fa-table-list  nav-icon w-0"
                                                   style={{fontSize: '10px'}}></i>
                                                <span className="nav-text">Materiels Réparés</span>
                                            </Link>
                                        </li>
                                    </ul>
                                }
                                <li >
                                    <Link to="/materielsAreparer" style={{fontSize: '12px'}}>
                                        <i className="fa-solid fa-table-list nav-icon w-0"
                                           style={{fontSize: '10px'}}></i>
                                        <span className="nav-text">Materiels à Réparer</span>
                                    </Link>
                                </li>
                            </ul>}
                        </li>

                        {(userData.permissions.includes("view_clients") || userData.permissions.includes("add_client")) &&
                            <li className={`nav-item`}>
                                <b></b>
                                <b></b>
                                <div
                                    className={`nav-div nav-item ${(window.location.pathname === "/clients" ||
                                        window.location.pathname === "/AddClient"
                                    || window.location.pathname==="/contracts") && "active"}`}
                                    onClick={() => handleSubMenuClick("clients")}>
                                    <i className="fa-solid fa-user-tie nav-icon"></i>
                                    <span className="nav-text">Clients</span>
                                    <svg aria-hidden="true" focusable="false" role="img"
                                         className="octicon octicon-triangle-down" viewBox="0 0 16 16"
                                         width="18" height="18" fill="currentColor"
                                         style={{
                                             display: "inline-block",
                                             userSelect: "none",
                                             verticalAlign: "text-bottom",
                                             overflow: "visible"
                                         }}>
                                        {subMenuOpen["clients"] ?
                                            <path
                                                d="M4.427 8.573L7.823 5.177a.25.25 0 0 1 .354 0l3.396 3.396a.25.25 0 0 1-.177.427H4.604a.25.25 0 0 1-.177-.427z">
                                            </path>
                                            :
                                            <path
                                                d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z">
                                            </path>
                                        } </svg>
                                </div>

                                <ul>
                                    {subMenuOpen["clients"] && userData.permissions.includes("add_client") &&
                                        <li className={`nav-item `}>
                                            <Link to="/AddClient" style={{fontSize: '12px'}}>
                                                <i className="fa-solid fa-plus nav-icon w-0"
                                                   style={{fontSize: '10px'}}></i>
                                                <span className="nav-text">Ajouter Client</span>
                                            </Link>
                                        </li>}
                                    {subMenuOpen["clients"] && userData.permissions.includes("view_clients") &&
                                        <li className={`nav-item `}>
                                            <Link to="/clients" style={{fontSize: '12px'}}>
                                                <i className="fa-solid fa-table-list nav-icon w-0"
                                                   style={{fontSize: '10px'}}></i>
                                                <span className="nav-text">Liste Clients</span>
                                            </Link>
                                        </li>}
                                    {subMenuOpen["clients"] && userData.permissions.includes("view_contracts") &&
                                        <li className={`nav-item `}>
                                            <Link to="/contracts" style={{fontSize: '12px'}}>
                                                <i className="fa-solid fa-table-list nav-icon w-0"
                                                   style={{fontSize: '10px'}}></i>
                                                <span className="nav-text">Contractuels</span>
                                            </Link>
                                        </li>}
                                </ul>

                            </li>}


                        {(userData.permissions.includes("view_users") || userData.permissions.includes("add_user")) &&
                            <li className={`nav-item `}>
                                <b></b>
                                <b></b>
                                <div
                                    className={`nav-div nav-item ${(window.location.pathname === "/users" || window.location.pathname === "/AddUser") && "active"}`}
                                    onClick={() => handleSubMenuClick("users")}>
                                    <i className="fa-sharp fa-solid fa-users nav-icon"></i>
                                    <span className="nav-text">Utilisateurs</span>
                                    <svg aria-hidden="true" focusable="false" role="img"
                                         className="octicon octicon-triangle-down" viewBox="0 0 16 16"
                                         width="18" height="18" fill="currentColor"
                                         style={{
                                             display: "inline-block",
                                             userSelect: "none",
                                             verticalAlign: "text-bottom",
                                             overflow: "visible"
                                         }}>
                                        {subMenuOpen["users"] ?
                                            <path
                                                d="M4.427 8.573L7.823 5.177a.25.25 0 0 1 .354 0l3.396 3.396a.25.25 0 0 1-.177.427H4.604a.25.25 0 0 1-.177-.427z">
                                            </path>
                                            :
                                            <path
                                                d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z">
                                            </path>
                                        } </svg>
                                </div>
                                <ul>
                                    {subMenuOpen["users"] && userData.permissions.includes("add_user") &&
                                        <li className={`nav-item `}>
                                            <Link to="/AddUser" style={{fontSize: '12px'}}>
                                                <i className="fa-solid fa-plus nav-icon w-0"
                                                   style={{fontSize: '10px'}}></i>
                                                <span className="nav-text">Ajouter Utilisateur</span>
                                            </Link>
                                        </li>
                                    }
                                    {subMenuOpen["users"] && userData.permissions.includes("view_users") &&
                                        <li className={`nav-item `}>
                                            <Link to="/users" style={{fontSize: '12px'}}>
                                                <i className="fa-solid fa-table-list nav-icon w-0"
                                                   style={{fontSize: '10px'}}></i>
                                                <span className="nav-text">Liste Utilisateurs</span>
                                            </Link>
                                        </li>
                                    }
                                </ul>
                            </li>}
                        {(userData.permissions.includes("view_roles") || userData.permissions.includes("add_role")) &&
                            <li className={`nav-item `}>
                                <b></b>
                                <b></b>
                                <div
                                    className={`nav-div nav-item ${(window.location.pathname === "/AddRole" || window.location.pathname === "/roles") && "active"}`}
                                    onClick={() => handleSubMenuClick("roles")}>
                                    <i className="fa-solid fa-scale-balanced nav-icon"></i>
                                    <span className="nav-text">
                                        Rôles
                                    </span>
                                    <svg aria-hidden="true" focusable="false" role="img"
                                         className="octicon octicon-triangle-down" viewBox="0 0 16 16"
                                         width="18" height="18" fill="currentColor"
                                         style={{
                                             display: "inline-block",
                                             userSelect: "none",
                                             verticalAlign: "text-bottom",
                                             overflow: "visible"
                                         }}>
                                        {subMenuOpen["roles"] ?
                                            <path
                                                d="M4.427 8.573L7.823 5.177a.25.25 0 0 1 .354 0l3.396 3.396a.25.25 0 0 1-.177.427H4.604a.25.25 0 0 1-.177-.427z">
                                            </path>
                                            :
                                            <path
                                                d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z">
                                            </path>
                                        }</svg>
                                </div>
                                <ul>
                                    {subMenuOpen["roles"] && userData.permissions.includes("add_role") &&
                                        <li className={`nav-item `}>
                                            <Link to="/AddRole" style={{fontSize: '12px'}}>
                                                <i className="fa-solid fa-plus nav-icon w-0"
                                                   style={{fontSize: '10px'}}></i>
                                                <span className="nav-text">Ajouter Rôle</span>
                                            </Link>
                                        </li>
                                    }
                                    {subMenuOpen["roles"] && userData.permissions.includes("view_roles") &&
                                        <li className={`nav-item `}>
                                            <Link to="/roles" style={{fontSize: '12px'}}>
                                                <i className="fa-solid fa-table-list nav-icon w-0"
                                                   style={{fontSize: '10px'}}></i>
                                                <span className="nav-text">Liste Rôles</span>
                                            </Link>
                                        </li>
                                    }
                                </ul>
                            </li>
                        }

                        <li className={`nav-item `}>
                            <b></b>
                            <b></b>
                            <div
                                className={`nav-div nav-item ${window.location.pathname === "/historyUser" && "active"}`}
                                onClick={() => handleSubMenuClick("history")}>
                                <i className="fa-solid fa-clock-rotate-left nav-icon"></i>
                                <span className="nav-text">Historique</span>
                                <svg aria-hidden="true" focusable="false" role="img"
                                     className="octicon octicon-triangle-down" viewBox="0 0 16 16"
                                     width="18" height="18" fill="currentColor"
                                     style={{
                                         display: "inline-block",
                                         userSelect: "none",
                                         verticalAlign: "text-bottom",
                                         overflow: "visible"
                                     }}>
                                    {subMenuOpen["history"] ?
                                        <path
                                            d="M4.427 8.573L7.823 5.177a.25.25 0 0 1 .354 0l3.396 3.396a.25.25 0 0 1-.177.427H4.604a.25.25 0 0 1-.177-.427z">
                                        </path>
                                        :
                                        <path
                                            d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z">
                                        </path>
                                    }</svg>
                            </div>
                            {subMenuOpen["history"] && <ul>
                                <li>
                                    <Link to="/historyUser" style={{fontSize: '12px'}}>
                                        <i className="fa-solid fa-table-list nav-icon w-0"
                                           style={{fontSize: '10px'}}></i>
                                        <span className="nav-text">Materiels Réparés</span>
                                    </Link>
                                </li>
                            </ul>}
                        </li>

                    </ul>
                </div>
            </nav>
        </>
    )
}