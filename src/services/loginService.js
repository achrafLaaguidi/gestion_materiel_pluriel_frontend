

    let saveToken=(token)=>{
localStorage.setItem('token',token)
    }

    let logout=()=>{
        localStorage.removeItem('token')
    }

    let isLogged=()=>{
        return !!localStorage.getItem('token')
    }
export const loginService={
    saveToken,logout,isLogged
}