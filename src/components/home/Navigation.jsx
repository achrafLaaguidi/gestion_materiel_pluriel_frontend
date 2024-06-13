import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginService } from "../../services/loginService";
import { jwtDecode } from "jwt-decode";
import './home.css';
import '../../style.css';

// Fonction pour vérifier si le chemin actuel commence par l'un des chemins spécifiés
const isPathActive = (paths) => {
    return paths.some(path => window.location.pathname.startsWith(path));
};

// Composant NavItem pour gérer un ou plusieurs chemins
const NavItem = ({ icon, text, onClick, isActive, isSubMenuOpen, isSubMenu }) => (
    <li className={`nav-item ${isActive ? 'active' : ''}`} onClick={onClick}>
        <b></b>
        <b></b>
        <div className={`nav-div nav-item ${isActive && "active"}`}>
            <i className={`fa ${icon} nav-icon`}></i>
            <span className="nav-text">{text}</span>
            {isSubMenu !== undefined && (
                <svg aria-hidden="true" focusable="false" role="img"
                    className="octicon octicon-triangle-down" viewBox="0 0 16 16"
                    width="18" height="18" fill="currentColor"
                    style={{
                        display: "inline-block",
                        userSelect: "none",
                        verticalAlign: "text-bottom",
                        overflow: "visible"
                    }}>
                    {isSubMenuOpen ? (
                        <path
                            d="M4.427 8.573L7.823 5.177a.25.25 0 0 1 .354 0l3.396 3.396a.25.25 0 0 1-.177.427H4.604a.25.25 0 0 1-.177-.427z">
                        </path>
                    ) : (
                        <path
                            d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z">
                        </path>
                    )}
                </svg>
            )}
        </div>
    </li>
);

// Composant SubMenuItem
const SubMenuItem = ({ to, icon, text }) => (
    <li className="nav-item">
        <Link to={to} style={{ fontSize: '12px' }}>
            <i className={`fa ${icon} nav-icon w-0`} style={{ fontSize: '10px' }}></i>
            <span className="nav-text">{text}</span>
        </Link>
    </li>
);

// Composant DropdownMenu
const DropdownMenu = ({ isOpen, items }) => (
    isOpen && (
        <ul>
            {items.map(item => (
                <SubMenuItem key={item.to} {...item} />
            ))}
        </ul>
    )
);

export default function Navigation() {
    const navigate = useNavigate();
    const userData = jwtDecode(localStorage.getItem('token'));

    const [subMenuOpen, setSubMenuOpen] = useState({});
    const [showLogoutButton, setShowLogoutButton] = useState(false);

    const handleSubMenuClick = (navItem) => {
        setSubMenuOpen(prevState => ({
            ...prevState,
            [navItem]: !prevState[navItem]
        }));
    };

    const handleUsernameClick = () => {
        setShowLogoutButton(!showLogoutButton);
    };

    const logout = () => {
        loginService.logout();
        navigate("/login");
    };

    // Éléments de navigation principaux
    const navItems = [
        {
            paths: ["/Home"],
            icon: "fa-house",
            text: "Accueil",
            condition: true
        },
        {
            paths: ["/AddMateriel", "/materielsAreparer", "/MaterielsRepareesByAll", "/materielsAnnoncee", "/historyUsers", "/ModifyMateri", "/ModifyAnnonceMateriel", "/ModifyMaterialRepairByAll"],
            icon: "fa-boxes-stacked",
            text: "Materiels",
            condition: userData.permissions.includes("view_materials") || userData.permissions.includes("add_material"),
            submenu: [
                { to: "/AddMateriel", icon: "fa-plus", text: "Ajouter Materiel" },
                userData.permissions.includes('add_annonce') && { to: "/materielsAnnoncee", icon: "fa-table-list", text: "Annonces" },
                userData.permissions.includes('view_materials') && [
                    { to: "/MaterielsRepareesByAll", icon: "fa-table-list", text: "Materiels En Attente" },
                    { to: "/historyUsers", icon: "fa-table-list", text: "Materiels Réparés" },
                ],
                { to: "/materielsAreparer", icon: "fa-table-list", text: "Materiels à Réparer" },
            ].filter(Boolean).flat()
        },
        {
            paths: ["/AddClient", "/clients", "/contracts", "/ModifyClient", "/ModifyContract", "/ContractInfo"],
            icon: "fa-user-tie",
            text: "Clients",
            condition: userData.permissions.includes("view_clients") || userData.permissions.includes("add_client"),
            submenu: [
                userData.permissions.includes("add_client") && { to: "/AddClient", icon: "fa-plus", text: "Ajouter Client" },
                userData.permissions.includes("view_clients") && { to: "/clients", icon: "fa-table-list", text: "Liste Clients" },
                userData.permissions.includes("view_contracts") && { to: "/contracts", icon: "fa-table-list", text: "Contractuels" },
            ].filter(Boolean)
        },
        {
            paths: ["/users", "/AddUser", "/ModifyUser"],
            icon: "fa-users",
            text: "Utilisateurs",
            condition: userData.permissions.includes("view_users") || userData.permissions.includes("add_user"),
            submenu: [
                userData.permissions.includes("add_user") && { to: "/AddUser", icon: "fa-plus", text: "Ajouter Utilisateur" },
                userData.permissions.includes("view_users") && { to: "/users", icon: "fa-table-list", text: "Liste Utilisateurs" },
            ].filter(Boolean)
        },
        {
            paths: ["/roles", "/AddRole", "/ModifyRole"],
            icon: "fa-scale-balanced",
            text: "Rôles",
            condition: userData.permissions.includes("view_roles") || userData.permissions.includes("add_role"),
            submenu: [
                userData.permissions.includes("add_role") && { to: "/AddRole", icon: "fa-plus", text: "Ajouter Rôle" },
                userData.permissions.includes("view_roles") && { to: "/roles", icon: "fa-table-list", text: "Liste Rôles" },
            ].filter(Boolean)
        },
        {
            paths: ["/History"],
            icon: "fa-clock-rotate-left",
            text: "Historique",
            condition: true,
            submenu: [{ to: "/History", icon: "fa-table-list", text: "Materiels Réparés" }]
        }
    ].filter(item => !item.condition || item.condition);

    return (
        <nav className="main-menu">
            <div className="nav-menu">
                <div className="row align-items-center" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }} onClick={handleUsernameClick}>
                    {showLogoutButton && (
                        <button className="btn btn-dark w-auto" onClick={logout} style={{ marginRight: '5px' }}>
                            <i className="fa fa-right-from-bracket nav-icon w-auto"></i>
                        </button>
                    )}
                    <button className="btn btn-outline-light mb-1 mt-0" style={{ fontSize: "1.2rem" }}>
                        {userData.sub}
                    </button>
                </div>
                <ul>
                    {navItems.map(item => (
                        item.condition && <React.Fragment key={item.paths[0]}>
                            <NavItem
                                paths={item.paths}
                                icon={item.icon}
                                text={item.text}
                                onClick={() => {
                                    if (item.submenu) {
                                        handleSubMenuClick(item.paths[0]);
                                    } else {
                                        navigate(item.paths[0]);
                                    }
                                }}
                                isActive={isPathActive(item.paths)}
                                isSubMenu={item.submenu}
                                isSubMenuOpen={subMenuOpen[item.paths[0]]}
                            />
                            {item.submenu && <DropdownMenu isOpen={subMenuOpen[item.paths[0]]} items={item.submenu} />}
                        </React.Fragment>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
