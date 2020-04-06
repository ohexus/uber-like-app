import React, { useState } from 'react';
import { CSVLink } from 'react-csv';

export default function ReportDownloadExcel(props) {
  const [load] = useState(props.load);
  const [length] = useState(load.dimensions.length);
  const [width] = useState(load.dimensions.width);
  const [height] = useState(load.dimensions.height);
  const [payload] = useState(load.payload);

  const headers = [
    { label: 'Title', key: 'title' },
    { label: 'Value', key: 'value' },
  ];

  const data = [
    { title: 'length', value: length },
    { title: 'width', value: width },
    { title: 'height', value: height },
    { title: 'payload', value: payload },
  ];

  return (
    <CSVLink
      headers={ headers }
      data={ data }
      separator={ ';' }
      filename={ 'loadreport.csv' }
    >
      Download Excel
    </CSVLink>
  );
}
