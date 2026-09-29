import Swal from "sweetalert2";

export const showSuccess = (
    title,
    text = ""
) => {

    return Swal.fire({
        icon: "success",
        title,
        text,
        confirmButtonColor: "#193260"
    });
};


export const showError = (
    title,
    text = ""
) => {

    return Swal.fire({
        icon: "error",
        title,
        text,
        confirmButtonColor: "#193260"
    });
};


export const showWarning = (
    title,
    text = ""
) => {
    return Swal.fire({
        icon: "warning",
        title,
        text,
        confirmButtonColor: "#193260"
    });
};


export const showLoading = (
    title = "Please wait..."
) => {

    Swal.fire({
        title,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
};

export const closeAlert = () => {
    Swal.close();
};

export const showConfirm = (
    title,
    text = "",
    confirmButtonText = "Yes"
) => {
    return Swal.fire({
        icon: "warning",
        title,
        text,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d"
    });
};