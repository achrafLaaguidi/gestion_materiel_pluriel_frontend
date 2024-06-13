import { MakeRequest } from "./MakeRequest";
import Swal from "sweetalert2";

const handleDelete = ({ fetchData, api }) => {

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            try {
                MakeRequest(`${process.env.REACT_APP_BASE_URL}${api}`, 'DELETE')
                    .then(data => {
                        if (data) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
                                icon: "success",
                                showConfirmButton: false,
                                timer: 1000
                            });
                            fetchData()
                        }
                    })
            } catch (error) {
                console.error("Erreur:", error);
            }

        }
    });
};

export { handleDelete };