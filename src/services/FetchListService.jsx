import {MakeRequest} from "./MakeRequest";

 async function FetchListRoles() {
    try {
        return  await MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/user/listRoles`, 'GET')
            .then(data=>{
                if(data){
                    return data
                }
        })
    } catch (error) {
        console.error("Erreur:", error);
    }

}
async function FetchListPermissions() {
    try {
        return  await MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/user/listPermissions`,'GET')
            .then(data=>{
                if(data){
                    return data
                }
        })
    } catch (error) {
        console.error("Erreur:", error);
    }
}
 async function FetchListUser() {
    try {
        return  await MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/user/listUser`, 'GET').then(data=>{
            if(data){
                return data
            }
        })
    } catch (error) {
        console.error("Erreur:", error);
    }
}
async function FetchListClient() {
    try {
        return  await MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/client/listClient`, 'GET').then(data=>{
            if(data){
                return data
            }
        })
    } catch (error) {
        console.error("Erreur:", error);
    }
}
async function FetchListContract() {
    try {
        return  await MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/contract/listContract`, 'GET')
            .then(data=>{
            if(data){
                return data
            }
        })
    } catch (error) {
        console.error("Erreur:", error);
    }
}
async function FetchListMaterielOfDay() {
    try {
        return  await MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/material/list_Materials_Of_Today`,
            'GET')
            .then(data=>{
            if(data){
                return data
            }
        })
    } catch (error) {
        console.error("Erreur:", error);
    }
}
async function FetchListMaterielByAll() {
    try {
        return  await MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/material/listMaterialsRepairByAll`, 'GET')
            .then(data=>{
            if(data){
                return data
            }
        })
    } catch (error) {
        console.error("Erreur:", error);
    }
}
async function FetchListUserActive() {
    try {
        return  await MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/user/listUserActive`, 'GET')
            .then(data=>{
            if(data){
                return data
            }
        })
    } catch (error) {
        console.error("Erreur:", error);
    }
}


export const FetchListService={
      FetchListRoles,
    FetchListPermissions,
    FetchListUser,
    FetchListClient,
    FetchListContract,
    FetchListMaterielOfDay,
    FetchListMaterielByAll,
    FetchListUserActive
}
