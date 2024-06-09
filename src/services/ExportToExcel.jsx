import React, { useEffect, useState } from 'react';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export const ExportToExcel = ({ apiData, fileName }) => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const [modifiedData, setModifiedData] = useState([]);

    useEffect(() => {
        if (fileName === "Materiel En Reparation") {
            setModifiedData(apiData.map(item => ({
                MATERIELS: item.name,
                NUMERO_DE_SERIE: item.seriesNumber,
                CLIENT: item.client.dénominationSociale,
                TECHNICIEN: item.technician.username,
                DATE_ENTRER: item.entryDate,
                DATE_RETOUR: item.releaseDate,
                REMARQUE: item.intervention
            })));
        } else if (fileName === "Clients") {
            setModifiedData(apiData.map(item => ({
                NUMERO_INSCRIPTION: item.ninscription,
                CLIENT: item.dénominationSociale,
                VILLE: item.ville,
            })));
        }
    }, [apiData, fileName]);

    const exportToCSV = () => {
        const ws = XLSX.utils.json_to_sheet(modifiedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Feuille1");

        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            let maxWidth = 0;
            for (let R = range.s.r; R <= range.e.r; ++R) {
                const cellAddress = { c: C, r: R };
                const cellRef = XLSX.utils.encode_cell(cellAddress);
                if (!ws[cellRef]) continue;
                const cellValue = ws[cellRef].v !== null ? ws[cellRef].v.toString() : '';
                maxWidth = Math.max(maxWidth, cellValue.length);
            }
            ws['!cols'] = ws['!cols'] || [];
            ws['!cols'][C] = { wch: maxWidth + 2 };
        }

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: fileType });

        FileSaver.saveAs(blob, fileName + fileExtension);
    };

    return (
        <button onClick={exportToCSV} className="w-auto">
            <i className="fa-solid fa-file-export"></i> Exporter
        </button>
    );
};
