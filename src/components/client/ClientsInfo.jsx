import React from 'react';
import { Document, Page, StyleSheet, Font, Image, Text, View, PDFViewer } from '@react-pdf/renderer';
import images from "../../images/Images";
import { useLocation } from 'react-router-dom';

Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        padding: 30,
        lineHeight: 1.6,
    },
    header: {
        textAlign: 'center',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    title: {

        fontFamily: 'Oswald',
        fontSize: 18,
        textDecoration: 'underline',
    },
    section: {
        fontSize: 14,
    },
    boldBlueText: {
        color: 'blue',
    },
    footer: {
        marginTop: 20,
        paddingTop: 10,
        textAlign: 'center',
        fontSize: 10,
    },
    cachetTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        textDecoration: 'underline'
    },
    sousCachet: {
        height: 70
    },
    cachet: {
        textAlign: 'right'
    }
});

const ClientsInfoPDF = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Image style={styles.image} src={images.PlurielLogo} />
                <Text style={styles.title}>FICHE-CLIENT</Text>
                <Text style={styles.title}>PERSONNE MORALE</Text>
            </View>
            <View style={styles.section}>
                <Text><Text style={{ fontWeight: 'bold' }}>Dénomination Sociale:</Text> <Text style={styles.boldBlueText}>{data.dénominationSociale}</Text></Text>
                <Text><Text style={{ fontWeight: 'bold' }}>Secteur d'activité:</Text> <Text style={styles.boldBlueText}>{data.secteurActivité}</Text></Text>
                <Text><Text style={{ fontWeight: 'bold' }}>Nature juridique:</Text> <Text style={styles.boldBlueText}>{data.natureJuridique}</Text></Text>
                <Text><Text style={{ fontWeight: 'bold' }}>Capital social:</Text> <Text style={styles.boldBlueText}>{data.capitalSocial}</Text></Text>
                <Text><Text style={{ fontWeight: 'bold' }}>Date de Création:</Text> <Text style={styles.boldBlueText}>{data.dateDeCreation}</Text></Text>
                <Text><Text style={{ fontWeight: 'bold' }}>Adresse:</Text> <Text style={styles.boldBlueText}>{data.adresse}</Text></Text>
                <Text><Text style={{ fontWeight: 'bold' }}>N° d'inscription au registre de commerce:</Text> <Text style={styles.boldBlueText}>{data.ninscription}</Text></Text>
                <Text><Text style={{ fontWeight: 'bold' }}>Ville:</Text> <Text style={styles.boldBlueText}>{data.ville}</Text></Text>
                <Text><Text style={{ fontWeight: 'bold' }}>Identifiant Fiscal:</Text> <Text style={styles.boldBlueText}>{data.identifiantFiscal}</Text></Text>
                <Text><Text style={{ fontWeight: 'bold' }}>Patente:</Text> <Text style={styles.boldBlueText}>{data.patente}</Text></Text>
                <Text><Text style={{ fontWeight: 'bold' }}>N°CNSS:</Text> <Text style={styles.boldBlueText}>{data.ncnss}</Text></Text>
                <Text><Text style={{ fontWeight: 'bold' }}>I.C.E:</Text> <Text style={styles.boldBlueText}>{data.ice}</Text></Text>
                <Text><Text style={{ fontWeight: 'bold' }}>Téléphone:</Text> <Text style={styles.boldBlueText}>{data.telephone}</Text></Text>
                <Text><Text style={{ fontWeight: 'bold' }}>Fax::</Text> <Text style={styles.boldBlueText}>{data.fax}</Text></Text>
                <Text><Text style={{ fontWeight: 'bold' }}>E-mail:</Text> <Text style={styles.boldBlueText}>{data.email}</Text></Text>
                <Text><Text style={{ fontWeight: 'bold' }}>Représentant légal de la société:</Text> <Text style={styles.boldBlueText}>{data.representantLegalSociete}</Text></Text>
                <Text>(Personne autorisée à engager la société vis-à-vis des tiers)</Text>
                <Text><Text style={{ fontWeight: 'bold' }}>Fonction:</Text> <Text style={styles.boldBlueText}>{data.fonction}</Text></Text>
            </View>
            <View style={styles.cachet}>
                <Text style={styles.cachetTitle}>
                    CACHET ET SIGNATURE DU REPRESENTANT LEGAL
                </Text>
                <View style={styles.sousCachet}>
                </View>
            </View>
            <View style={styles.footer}>
                <Text>113, Avenue Abdelkarim EL Khattabi - Marrakech</Text>
                <Text>R.C.5965 - C.N.S.S. 2059881 - Identifiant fiscal 06500647 - I.C.E 001565980000064</Text>
                <Text>Tél: (212) (5 24) 44.75.33/44.84.04/43.65.20 - Fax (212) (5 24) 43.65.18</Text>
            </View>
        </Page>
    </Document>
);

const ClientsInfo = () => {
    const location = useLocation();
    const rowData = location.state?.data || {};


    return (
        <>
            <PDFViewer style={{ width: '100%', height: '100vh' }} >
                <ClientsInfoPDF data={rowData} />
            </PDFViewer>
        </>
    );
}

export default ClientsInfo;