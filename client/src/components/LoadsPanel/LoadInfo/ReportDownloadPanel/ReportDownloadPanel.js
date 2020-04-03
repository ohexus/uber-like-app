import React, { useState } from 'react';
import './ReportDownloadPanel.scss';

import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportDownloadPdf from './ReportDownloadPdf/ReportDownloadPdf';
import ReportDownloadExcel from './ReportDownloadExcel/ReportDownloadExcel';

export default function ReportDownloadPanel(props) {
    const [load] = useState(props.load);

    return (
        <div className='report-panel'>
            <PDFDownloadLink
                document={<ReportDownloadPdf load={load} />}
                fileName="loadreport.pdf"
            > Download Pdf </PDFDownloadLink>
            
            <ReportDownloadExcel load={load} />
        </div>
    );
}