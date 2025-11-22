import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 30,
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    subtitle: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 5,
    },
    section: {
        margin: 10,
        padding: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#374151',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    label: {
        fontSize: 12,
        color: '#4b5563',
    },
    value: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#111827',
    },
    scoreBox: {
        padding: 10,
        backgroundColor: '#f3f4f6',
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    scoreValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2563eb',
    },
    scoreLabel: {
        fontSize: 10,
        color: '#6b7280',
    },
});

interface TrustProfilePDFProps {
    partnerName: string;
    overallScore: number;
    domainScores: { domain: string; score: number }[];
    generatedAt: string;
}

export const TrustProfilePDF = ({ partnerName, overallScore, domainScores, generatedAt }: TrustProfilePDFProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>Trust Profile</Text>
                <Text style={styles.subtitle}>Generated for {partnerName} on {generatedAt}</Text>
            </View>

            <View style={styles.section}>
                <View style={styles.scoreBox}>
                    <Text style={styles.scoreValue}>{overallScore}%</Text>
                    <Text style={styles.scoreLabel}>Overall Trust Score</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Domain Breakdown</Text>
                {domainScores.map((ds, index) => (
                    <View key={index} style={styles.row}>
                        <Text style={styles.label}>{ds.domain}</Text>
                        <Text style={styles.value}>{ds.score}%</Text>
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About FutureForm</Text>
                <Text style={{ fontSize: 10, color: '#6b7280' }}>
                    FutureForm is the standard for trust-based due diligence. This report is generated based on verified assessment data.
                </Text>
            </View>
        </Page>
    </Document>
);
