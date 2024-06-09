import React from 'react';

import {Navigate, Outlet} from 'react-router-dom'
import {loginService} from "../services/loginService";

const useAuth=()=>{
  return loginService.isLogged()
}
const  PublicRoutes=(props:any) =>{

  const auth=useAuth()

  return auth?<Navigate to="/"/>: <Outlet/>
}

export default PublicRoutes;
