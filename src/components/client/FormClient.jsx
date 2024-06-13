import { InputField, RadioField } from "../../services/FormService";

const FormClient = ({ handleSend, handleReset, title, handleChange, clientData }) => {
    const natureJuridiqueOptions = [
        { value: 'SARL', label: 'S.A.R.L' },
        { value: 'SARLAU', label: 'S.A.R.L.A.U' },
        { value: 'SNC', label: 'S.N.C' },
        { value: 'SA', label: 'S.A' }
    ];

    const fonctionOptions = [
        { value: 'GERANT_UNIQUE', label: 'Gérant Unique' },
        { value: 'DG', label: 'DG' },
        { value: 'PDG', label: 'PDG' },
        { value: 'PRESIDENT_DU_DIRECTOIRE', label: 'PRESIDENT_DU_DIRECTOIRE' }
    ];
    return (
        <form onSubmit={handleSend} className="flex-column flex-wrap">
            <InputField id="dénominationSociale" label="Dénomination Sociale" type="text" value={clientData.dénominationSociale} onChange={handleChange} required />
            <InputField id="secteurActivité" label="Secteur Activité" type="text" value={clientData.secteurActivité} onChange={handleChange} />
            <RadioField name="natureJuridique" label="Nature Juridique" options={natureJuridiqueOptions} selectedValue={clientData.natureJuridique} onChange={handleChange} />
            <div className="row m-0">
                <InputField id="capitalSocial" label="Capital Social" type="number" value={clientData.capitalSocial} onChange={handleChange} />
                <InputField id="dateDeCreation" label="Date De Creation" type="date" value={clientData.dateDeCreation} onChange={handleChange} />
            </div>
            <InputField id="adresse" label="Adresse" type="text" value={clientData.adresse} onChange={handleChange} />
            <div className="row m-0">
                <InputField id="ninscription" label="N° d'inscription a Registre de Commerce" type="text" value={clientData.ninscription} onChange={handleChange} />
                <InputField id="ville" label="Ville" type="text" value={clientData.ville} onChange={handleChange} />
            </div>
            <InputField id="identifiantFiscal" label="Identifiant Fiscal" type="number" value={clientData.identifiantFiscal} onChange={handleChange} />
            <InputField id="patente" label="Patente" type="number" value={clientData.patente} onChange={handleChange} />
            <InputField id="ncnss" label="N°CNSS" type="number" value={clientData.ncnss} onChange={handleChange} />
            <InputField id="ice" label="I.C.E" type="number" value={clientData.ice} onChange={handleChange} />
            <div className="row m-0">
                <InputField id="telephone" label="Téléphone" type="text" value={clientData.telephone} onChange={handleChange} placeholder="2126123456789" />
                <InputField id="fax" label="Fax" type="text" value={clientData.fax} onChange={handleChange} placeholder="2125123456789" />
            </div>
            <InputField id="email" label="Email" type="email" value={clientData.email} onChange={handleChange} placeholder="exemple@exemple.com" />
            <InputField id="representantLegalSociete" label="Repésentant légal de la société" type="text" value={clientData.representantLegalSociete} onChange={handleChange} />
            <b className="bold">(Personne autorisée à engager la société vis-à-vis des tiers)</b>
            <RadioField name="fonction" label="Fonction" options={fonctionOptions} selectedValue={clientData.fonction} onChange={handleChange} />
            <div className="row m-0 align-items-center">
                <button type="submit" className="rounded-pill w-50 h-50 btn-success">{title}</button>
                <button type="reset" onClick={handleReset} className="btn w-50 btn-primary">Réset</button>
            </div>
        </form>
    )
}
export default FormClient;