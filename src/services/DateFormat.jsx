const formatFrenchDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
};
const convertToInputDateFormat = (dateString) => {
    if (!dateString) return ""; // Si la date est vide, renvoyer null
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};
export const DateFormat={
    formatFrenchDate,convertToInputDateFormat
}