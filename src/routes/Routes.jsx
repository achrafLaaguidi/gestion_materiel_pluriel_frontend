import { Routes, Route, Navigate, BrowserRouter, Outlet } from "react-router-dom"
import ProtectedRoutes from "./ProtectedRoutes";
import LoginPage from "../components/login/LoginPage";

import Clients from "../components/client/Clients";
import AddClient from "../components/client/AddClient";
import ModifyClient from "../components/client/ModifyClient";
import ClientsInfo from "../components/client/ClientsInfo";
import { AddContract } from "../components/contract/AddContract";
import { ModifyContract } from "../components/contract/ModifyContract";
import Contracts from "../components/contract/Contracts";
import { ContractInfo } from "../components/contract/ContractInfo";
import PermissionDenied from "./Denied/PermissionDenied";
import PublicRoutes from "./PublicRoutes";
import { PageNotFound } from "../components/PageNotFound/PageNotFound";
import ModifyMaterialRepairByAll from "../components/material/AllMaterielsReparation/ModifyMaterialRepairByAll";
import MaterielsRepareesByAll from "../components/material/AllMaterielsReparation/MaterielsReparéesByAll";
import MaterielsAnnoncee from "../components/material/AnnoncementMateriel/MaterielsAnnoncee";
import ModifyAnnonceMateriel from "../components/material/AnnoncementMateriel/ModifyAnnonceMateriel";
import AddMateriel from "../components/material/AnnoncementMateriel/AddMateriel";
import ListMaterielDemandeRepair from "../components/material/AnnoncementMateriel/ListMaterielDemandeRepair";
import MaterielsAreparer from "../components/material/TechnicianMaterielsReparation/MaterielsAreparer";
import ModifyMaterielRepair from "../components/material/TechnicianMaterielsReparation/ModifyMaterielRepair";
import Home from "../components/home/Home";
import Users from "../components/user/Users";
import AddUser from "../components/user/AddUser";
import ModifyUser from "../components/user/ModifyUser";
import { Roles } from "../components/role/Roles";
import { AddRole } from "../components/role/AddRole";
import { ModifyRole } from "../components/role/ModifyRole";
import CheckPermissionForRoute from "./CheckPermissions";
import { HistoryUser } from "../components/material/Historique/HistoryUser";
import { HistoryUsers } from "../components/material/Historique/HistoryUsers";
import FicheTechniquePDF from "../components/material/FicheTechnique/FicheTechniquePDF";
import BonDeRetourPDF from "../components/material/BonDeRetour/BonDeRetourPDF";

const MainRoutes = () => (
	<BrowserRouter>
		<Routes>

			<Route path="/" element={<ProtectedRoutes />}>
				<Route path="/" element={<Outlet />}>
					<Route path={'/'} element={<Navigate replace to="/Home" />} />
					<Route path={'/Home'} element={<Home />} />

					<Route
						path="/users"
						element={CheckPermissionForRoute('view_users', Users)}
					/>
					<Route
						path="/AddUser"
						element={CheckPermissionForRoute('add_user', AddUser)}
					/>
					<Route
						path="/ModifyUser"
						element={CheckPermissionForRoute('edit_user', ModifyUser)}
					/>
					<Route
						path="/roles"
						element={CheckPermissionForRoute('view_roles', Roles)}
					/>
					<Route
						path="/AddRole"
						element={CheckPermissionForRoute('add_role', AddRole)}
					/>
					<Route
						path="/ModifyRole"
						element={CheckPermissionForRoute('edit_role', ModifyRole)}
					/>
					<Route
						path="/clients"
						element={CheckPermissionForRoute('view_clients', Clients)}
					/>
					<Route
						path="/ModifyClient"
						element={CheckPermissionForRoute('edit_client', ModifyClient)}
					/>
					<Route
						path="/ClientsInfo"
						element={CheckPermissionForRoute('view_clients', ClientsInfo)}
					/>
					<Route
						path="/AddClient"
						element={CheckPermissionForRoute('add_client', AddClient)}
					/>
					<Route
						path="/contracts"
						element={CheckPermissionForRoute('view_contracts', Contracts)}
					/>
					<Route
						path="/ContractInfo/:id"
						element={CheckPermissionForRoute('view_contracts', ContractInfo)}
					/>
					<Route
						path="/AddContract/:id"
						element={CheckPermissionForRoute('add_contract', AddContract)}
					/>
					<Route
						path="/ModifyContract"
						element={CheckPermissionForRoute('edit_contract', ModifyContract)}
					/>
					<Route
						path="/AddMateriel"
						element={CheckPermissionForRoute('add_material', AddMateriel)}
					/>
					<Route
						path="/ModifyAnnonceMateriel"
						element={CheckPermissionForRoute('edit_annonce', ModifyAnnonceMateriel)}
					/>
					<Route
						path="/materielsAnnoncee"
						element={CheckPermissionForRoute('view_materials', MaterielsAnnoncee)}
					/>
					<Route
						path="/MaterielsRepareesByAll"
						element={CheckPermissionForRoute('view_materials', MaterielsRepareesByAll)}
					/>
					<Route
						path="/ModifyMaterialRepairByAll"
						element={CheckPermissionForRoute('edit_materials', ModifyMaterialRepairByAll)}
					/>

					<Route
						path="/ListMaterielDemandeRepair"
						element={CheckPermissionForRoute('view_material', ListMaterielDemandeRepair)}
					/>
					<Route
						path="/materielsAreparer"
						element={CheckPermissionForRoute('view_material', MaterielsAreparer)}
					/>
					<Route
						path="/FicheTechnique"
						element={CheckPermissionForRoute('view_material', FicheTechniquePDF)}
					/>

					<Route
						path="/BonDeRetour"
						element={CheckPermissionForRoute('view_material', BonDeRetourPDF)}
					/>
					<Route
						path="/ModifyMaterielRepair"
						element={CheckPermissionForRoute('edit_material', ModifyMaterielRepair)}
					/>

					<Route
						path="/historyUser"
						element={CheckPermissionForRoute('view_material', HistoryUser)}
					/>
					<Route
						path="/historyUsers"
						element={CheckPermissionForRoute('view_materials', HistoryUsers)}
					/>
				</Route>
			</Route>


			<Route path="login" element={<PublicRoutes />}>
				<Route path={'/login'} element={<LoginPage />} />
			</Route>
			<Route path={'*'} element={<PageNotFound />} />

			<Route path="/denied" element={<PermissionDenied />} />
		</Routes>
	</BrowserRouter>
)

export default MainRoutes
