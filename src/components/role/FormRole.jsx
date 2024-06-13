import { InputField } from "../../services/FormService";

const FormRole = ({ handleSend, handleReset, title, handlePermissionSelectChange, roleData, setRoleData, listPermission }) => {

    return (
        <form onSubmit={handleSend}>
            <InputField
                id="roleName"
                label="Rôle"
                type="text"
                value={roleData.roleName}
                onChange={(e) => setRoleData({ ...roleData, roleName: e.target.value })}
                required={true}
            />
            <div className="mb-3">
                <label htmlFor="permissions" className="form-label">Permissions</label>
                <div
                    className="row flex-wrap justify-content-around align-items-center p-0 m-0"
                    style={{
                        border: "1px solid #ced4da",
                        borderRadius: "0.25rem",
                        textShadow: "0 0 0 #495057",
                    }}
                >
                    {listPermission.map((permission) => (
                        <div key={permission.id} className="row m-1">
                            <input
                                type="checkbox"
                                id={permission.id}
                                checked={roleData.permissions.some(p => p.id === permission.id)}
                                onChange={() => handlePermissionSelectChange(permission)}
                            />
                            <label htmlFor={permission.id}>{permission.name}</label>
                        </div>
                    ))}
                </div>
                {roleData.permissions.length < 1 && (
                    <p className="text-center" style={{ color: 'red' }}>
                        Veuillez sélectionner au moins une permission
                    </p>
                )}
            </div>
            <div className="row m-0 align-items-center">
                {roleData.permissions.length > 0 && (
                    <button type="submit" className="rounded-pill h-50 w-50 btn-success">
                        {title}
                    </button>
                )}
                <button type="reset" onClick={handleReset} className="btn w-50 btn-primary">
                    Réset
                </button>
            </div>
        </form>
    )
}
export default FormRole;