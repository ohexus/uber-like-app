import React, { useState } from 'react';
import './ReportDownloadPanel.scss';

import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportDownloadPdf from './ReportDownloadPdf/ReportDownloadPdf';

export default function ReportDownloadPanel(props) {
    const [load] = useState(props.load);

    return (
        <div className='report-panel'>
            <PDFDownloadLink
                document={<ReportDownloadPdf load={load} />}
                fileName="loadreport.pdf"
            > "Download Pdf" </PDFDownloadLink>
        </div>
    );
}