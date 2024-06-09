import React, {useState} from "react";
import '../../style.css';
import '../home/home.css';
import Navigation from "../home/Navigation";
import {useLocation, useNavigate} from "react-router-dom";
import {MakeRequest} from "../../services/MakeRequest";
import {DateFormat} from "../../services/DateFormat";
import Swal from "sweetalert2";
export default function ModifyClient() {
    const location = useLocation();
    console.log(location.state.data)
    const rowData =location.state.data;

    const [dénominationSociale, setDénominationSociale] = useState(rowData.dénominationSociale);
    const [secteurActivité, setSecteurActivité] = useState(rowData.secteurActivité);
    const [natureJuridique, setNatureJuridique] = useState(rowData.natureJuridique);
    const [capitalSocial, setCapitalSocial] = useState(rowData.capitalSocial);
    const [dateDeCreation, setDateDeCreation] = useState(DateFormat.convertToInputDateFormat(rowData.dateDeCreation));
    const [adresse, setAdresse] = useState(rowData.adresse);
    const [nInscription, setNInscription] = useState(rowData.ninscription);
    const [ville, setVille] = useState(rowData.ville);
    const [identifiantFiscal, setIdentifiantFiscal] = useState(rowData.identifiantFiscal);
    const [patente, setpatente] = useState(rowData.patente);
    const [NCNSS, setNCNSS] = useState(rowData.ncnss);
    const [ICE, setICE] = useState(rowData.ice);
    const [telephone, setTelephone] = useState(rowData.telephone);
    const [fax, setFax] = useState(rowData.fax)
    const [email, setEmail] = useState(rowData.email);
    const [representantLegalSociete, setRepresentantLegalSociete] = useState(rowData.representantLegalSociete);
    const [fonction, setFonction] = useState(rowData.fonction);

    const navigate=useNavigate()
    const handleModify = (event) => {
        event.preventDefault();
        const clientData = {
            id: rowData.id,
            dénominationSociale: dénominationSociale,
            secteurActivité: secteurActivité,
            natureJuridique: natureJuridique,
            capitalSocial: capitalSocial,
            dateDeCreation:DateFormat.formatFrenchDate( dateDeCreation),
            adresse: adresse,
            ninscription: nInscription,
            ville: ville,
            identifiantFiscal: identifiantFiscal,
            patente: patente,
            ncnss: NCNSS,
            ice: ICE,
            telephone: telephone,
            fax: fax,
            email: email,
            representantLegalSociete: representantLegalSociete,
            fonction: fonction
        }
        Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        }).then((result) => {
            if (result.isConfirmed) {
                MakeRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/client/modifyClient`
                    ,'PUT',clientData)
                    .then(data => {
                        if (data) {
                            navigate("/clients")
                            Swal.fire({
                                position: "top",
                                icon: "success",
                                title: "This client "+clientData.dénominationSociale+" has been saved",
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
                navigate("/clients")
                Swal.fire("Changes are not saved", "", "info");
            }
        });
    }

    return (  <>
        <main>
            <Navigation type="clients"/>
            <div className="card w-75">
                <h2 className="text-center text-dark">Modifier Client</h2>
                <form onSubmit={handleModify} className=" flex-column flex-wrap">
                    <div className="mb-3">
                        <label htmlFor="exampleInputText1" className="form-label">Dénomination Sociale</label>
                        <input type="text"
                               className="form-control"
                               id="exampleInputText1"
                               value={dénominationSociale}
                               onChange={(e) => {
                                   setDénominationSociale(e.target.value);
                               }}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputText2" className="form-label">Secteur Activité</label>
                        <input type="text"
                               className="form-control"
                               id="exampleInputText2"
                               value={secteurActivité}
                               onChange={(e) => {
                                   setSecteurActivité(e.target.value);
                               }}/>
                    </div>
                    <div className="mb-3">
                        <span>Nature juridique</span>
                        <div className="custom-radio m-2 row justify-content-between">
                            <div className="form-check  ">
                                <input className="form-check-input"
                                       type="radio"
                                       name="flexRadioDefaultone"
                                       id="flexRadioDefault1"
                                       value="SARL"
                                       checked={natureJuridique === 'SARL'}
                                       onChange={e => setNatureJuridique(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                    S.A.R.L
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefaultone"
                                       id="flexRadioDefault2"
                                       value="SARLAU"
                                       checked={natureJuridique === 'SARLAU'}
                                       onChange={e => setNatureJuridique(e.target.value)}/>
                                <label className="form-check-label" htmlFor="flexRadioDefault2">
                                    S.A.R.L.A.U
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefaultone"
                                       id="flexRadioDefault3"
                                       value="SNC"
                                       checked={natureJuridique === 'SNC'}
                                       onChange={e => setNatureJuridique(e.target.value)}/>
                                <label className="form-check-label" htmlFor="flexRadioDefault3">
                                    S.N.C
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefaultone"
                                       id="flexRadioDefault4"
                                       value="SA"
                                       checked={natureJuridique === 'SA'}
                                       onChange={e => setNatureJuridique(e.target.value)}/>
                                <label className="form-check-label" htmlFor="flexRadioDefault4">
                                    S.A
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className=" row m-0 ">
                        <div className="mb-3 w-50 ">
                            <label htmlFor="exampleInputText3" className="form-label">Capital Social</label>
                            <input type="number"
                                   className="form-control"
                                   id="exampleInputText3"
                                   value={capitalSocial}
                                   onChange={(e) => {
                                       setCapitalSocial(e.target.value);
                                   }}/>
                        </div>
                        <div className="mb-3 w-50 ">
                            <label htmlFor="exampleInputText4" className="form-label">Date De Creation</label>
                            <input type="date"
                                   className="form-control"
                                   id="exampleInputText4"
                                   value={dateDeCreation}
                                   onChange={(e) => {
                                       setDateDeCreation(e.target.value);
                                   }}/>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputText5" className="form-label">Adresse</label>
                        <input type="text"
                               className="form-control"
                               id="exampleInputText5"
                               value={adresse}
                               onChange={(e) => {
                                   setAdresse(e.target.value);
                               }}/>
                    </div>
                    <div className=" row m-0 ">
                        <div className="mb-3 w-50 ">
                            <label htmlFor="exampleInputText6" className="form-label">N° d'inscription a Registre de
                                Commerce</label>
                            <input type="text"
                                   className="form-control"
                                   id="exampleInputText6"
                                   value={nInscription}
                                   onChange={(e) => {
                                       setNInscription(e.target.value);
                                   }}/>
                        </div>
                        <div className="mb-3 w-50 ">
                            <label htmlFor="exampleInputText7" className="form-label">Ville</label>
                            <input type="text"
                                   className="form-control"
                                   id="exampleInputText7"
                                   value={ville}
                                   onChange={(e) => {
                                       setVille(e.target.value);
                                   }}/>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputText8" className="form-label">Identifiant Fiscal</label>
                        <input type="number"
                               className="form-control"
                               id="exampleInputText8"
                               value={identifiantFiscal}
                               onChange={(e) => {
                                   setIdentifiantFiscal(e.target.value);
                               }}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputText9" className="form-label">Patente</label>
                        <input type="number"
                               className="form-control"
                               id="exampleInputText9"
                               value={patente}
                               onChange={(e) => {
                                   setpatente(e.target.value);
                               }}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputText10" className="form-label">N°CNSS</label>
                        <input type="number"
                               className="form-control"
                               id="exampleInputText10"
                               value={NCNSS}
                               onChange={(e) => {
                                   setNCNSS(e.target.value);
                               }}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputText11" className="form-label">I.C.E</label>
                        <input type="number"
                               className="form-control"
                               id="exampleInputText11"
                               value={ICE}
                               onChange={(e) => {
                                   setICE(e.target.value);
                               }}/>
                    </div>
                    <div className=" row m-0 ">
                        <div className="mb-3 w-50 ">
                            <label htmlFor="exampleInputText12" className="form-label">Téléphone</label>
                            <input type="text"
                                   className="form-control"
                                   id="exampleInputText12"
                                   placeholder="2126123456789"
                                   value={telephone}
                                   onChange={(e) => {
                                       setTelephone(e.target.value);
                                   }}/>
                        </div>
                        <div className="mb-3 w-50 ">
                            <label htmlFor="exampleInputText13" className="form-label">Fax</label>
                            <input type="text"
                                   className="form-control"
                                   id="exampleInputText13"
                                   placeholder="2125123456789"
                                   value={fax}
                                   onChange={(e) => {
                                       setFax(e.target.value);
                                   }}/>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputText14" className="form-label">Email</label>
                        <input type="email"
                               className="form-control"
                               id="exampleInputText14"
                               placeholder="exemple@exemple.com"
                               value={email}
                               onChange={(e) => {
                                   setEmail(e.target.value);
                               }}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputText15" className="form-label">Repésentant légal de la
                            société</label>
                        <input type="text"
                               className="form-control"
                               id="exampleInputText15"
                               value={representantLegalSociete}
                               onChange={(e) => {
                                   setRepresentantLegalSociete(e.target.value);
                               }}/>
                    </div>
                    <b className="bold mb-3">(Personne autorisé à engager la société vis-à-vis des tiers)</b>
                    <div className="mb-3">
                        <span>Fonction</span>
                        <div className="custom-radio m-3 row justify-content-between">
                            <div className="form-check  ">
                                <input className="form-check-input"
                                       type="radio"
                                       name="flexRadioDefaulttwo"
                                       id="flexRadioDefault5"
                                       value="GERANT_UNIQUE"
                                       checked={fonction === 'GERANT_UNIQUE'}
                                       onChange={e => setFonction(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="flexRadioDefault5">
                                    Gérant Unique
                                </label>
                            </div>
                            <div className="form-check ">
                                <input className="form-check-input" type="radio" name="flexRadioDefaulttwo"
                                       id="flexRadioDefault6"
                                       value="DG"
                                       checked={fonction === 'DG'}
                                       onChange={e => setFonction(e.target.value)}/>
                                <label className="form-check-label" htmlFor="flexRadioDefault6">
                                    DG
                                </label>
                            </div>
                            <div className="form-check ">
                                <input className="form-check-input" type="radio" name="flexRadioDefaulttwo"
                                       id="flexRadioDefault7"
                                       value="PDG"
                                       checked={fonction === 'PDG'}
                                       onChange={e => setFonction(e.target.value)}/>
                                <label className="form-check-label" htmlFor="flexRadioDefault7">
                                    PDG
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefaulttwo"
                                       id="flexRadioDefault8"
                                       value="PRESIDENT_DU_DIRECTOIRE"
                                       checked={fonction === 'PRESIDENT_DU_DIRECTOIRE'}
                                       onChange={e => setFonction(e.target.value)}/>
                                <label className="form-check-label" htmlFor="flexRadioDefault8">
                                    PRESIDENT_DU_DIRECTOIRE
                                </label>
                            </div>
                        </div>
                    </div>
                        <button type="submit" className="btn btn-primary">Enregistrer</button>
                </form>
            </div>
        </main>
    </>)
}