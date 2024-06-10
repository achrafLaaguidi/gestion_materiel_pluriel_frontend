import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image, PDFViewer } from '@react-pdf/renderer';
import images from '../../../images/Images';
import { useLocation } from 'react-router-dom';

Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

const styles = StyleSheet.create({
    page: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "space-between",
        flexWrap: 'nowrap',
        height: '100%',
        padding: 35,
        fontFamily: 'Times-Roman',
        fontSize: 14,
        lineHeight: 1.6
    },
    header: {
        textAlign: 'center',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    Image: {
        width: 100,
        height: 100,
        justifyContent: "center"
    },
    title: {
        fontSize: 24,
        fontFamily: 'Oswald',
        marginBottom: 10
    },
    section: {
        margin: 10,
        padding: 10,
    },
    sectionText: {
        marginBottom: 10
    },
    footer: {
        marginTop: 20,
        borderTop: '2px solid rgb(199, 115, 4)',
        paddingTop: 10,
        textAlign: 'center',
        fontSize: 10
    },
    signatures: {
        borderTop: '1px solid #000',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingTop: 10
    },
    signature: {
        width: '30%',
        textAlign: 'center'
    },
    cadre: {
        border: '1px solid black',
        borderRadius: 5,
        height: 70,
        marginTop: 10
    },
    textarea: {
        marginBottom: 10,
        whiteSpace: 'pre-wrap',
        overflow: 'hidden',
        resize: 'none',
        fontWeight: 'bold',
        color: 'blue',
        padding: 5,
        borderRadius: 3,
        fontSize: 14
    },
    boldBlueText: {
        fontWeight: 'bold',
        color: 'blue'
    },
    borderOrange: {
        color: 'white',
        backgroundColor: 'rgb(199, 115, 4)',
        borderRadius: 5,
        width: '100%',
        padding: 5,
        textAlign: 'center',
        fontSize: 10
    }
});

const BonDeRetour = ({ data }) => (
    <Document title={`Bon De Retour ${data.id}`}>
        <Page size="A4" style={styles.page} >
            <View style={styles.header} >
                <Image style={styles.Image} src={images.PlurielLogo} />
                <Text style={styles.title}>BON-DE-RETOUR</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionText}>ETABLISSEMENT: <Text style={styles.boldBlueText}>{data.client && data.client.dénominationSociale}</Text></Text>
                <Text style={styles.sectionText}>NOM DU TECHNICIEN: <Text style={styles.boldBlueText}>{data.technician.username}</Text></Text>
                <Text style={styles.sectionText}>DESIGNATION DU MATERIEL: <Text style={styles.boldBlueText}>{data.name}</Text></Text>
                <Text style={styles.sectionText}>S/N: <Text style={styles.boldBlueText}>{data.seriesNumber}</Text></Text>
                <Text style={styles.sectionText}>DATE D'ENTREE: <Text style={styles.boldBlueText}>{data.entryDate}</Text></Text>
                <Text style={styles.sectionText}>INTERVENTION:</Text>
                <Text style={styles.textarea}>{data.intervention}</Text>
                <Text style={styles.sectionText}>DATE RETOUR: <Text style={styles.boldBlueText}>{data.releaseDate}</Text></Text>
            </View>
            <View style={styles.signatures}>
                <View style={styles.signature}>
                    <Text style={styles.borderOrange}>Signature du technicen</Text>
                    <View style={styles.cadre}></View>
                </View>
                <View style={styles.signature}>
                    <Text style={styles.borderOrange}>Cachet et Signature du client</Text>
                    <View style={styles.cadre}></View>
                </View>
                <View style={styles.signature}>
                    <Text style={styles.borderOrange}>Visa Direction</Text>
                    <View style={styles.cadre}></View>
                </View>
            </View>
            <View style={styles.footer}>
                <Text>113, Av, Abdekrim El Khttabi Résidence El Mouhandiz - Guéliz - Marrakech</Text>
                <Text>Tél.:(+212) 05 24 42 41 65 (LG) / 05 24 44 75 33 / 05 24 44 84 04 - Fax : (+212) 05 24 43 65 18 - Email : pluriel@pluriel.net</Text>
            </View>
        </Page>
    </Document>
);

const BonDeRetourPDF = () => {
    const location = useLocation();
    const rowData = location.state?.data || {};


    return (
        <>
            <PDFViewer style={{ width: '100%', height: '100vh' }} >
                <BonDeRetour data={rowData} />
            </PDFViewer>
        </>
    );
}

export default BonDeRetourPDF;
