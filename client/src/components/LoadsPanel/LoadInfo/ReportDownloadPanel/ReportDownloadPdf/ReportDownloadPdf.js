import React, { useState } from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 20,
  },
});

export default function ReportDownloadPdf(props) {
  const [load] = useState(props.load);
  const [length] = useState(load.dimensions.length);
  const [width] = useState(load.dimensions.width);
  const [height] = useState(load.dimensions.height);
  const [payload] = useState(load.payload);

  return (<>
    { load
      ? <Document>
        <Page style={ styles.page }>
          <Text style={ styles.title }> Load Report </Text>
          <View style={ styles.table }>
            <View style={ styles.tableRow }>
              <View style={ styles.tableCol }>
                <Text style={ styles.tableCell }> Title </Text>
              </View>
              <View style={ styles.tableCol }>
                <Text style={ styles.tableCell }> Value </Text>
              </View>
            </View>
            <View style={ styles.tableRow }>
              <View style={ styles.tableCol }>
                <Text style={ styles.tableCell }> Length </Text>
              </View>
              <View style={ styles.tableCol }>
                <Text style={ styles.tableCell }> { length } </Text>
              </View>
            </View>
            <View style={ styles.tableRow }>
              <View style={ styles.tableCol }>
                <Text style={ styles.tableCell }> Width </Text>
              </View>
              <View style={ styles.tableCol }>
                <Text style={ styles.tableCell }> { width } </Text>
              </View>
            </View>
            <View style={ styles.tableRow }>
              <View style={ styles.tableCol }>
                <Text style={ styles.tableCell }> Height </Text>
              </View>
              <View style={ styles.tableCol }>
                <Text style={ styles.tableCell }> { height } </Text>
              </View>
            </View>
            <View style={ styles.tableRow }>
              <View style={ styles.tableCol }>
                <Text style={ styles.tableCell }> Payload </Text>
              </View>
              <View style={ styles.tableCol }>
                <Text style={ styles.tableCell }> { payload } </Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
      : ''
    }
  </>);
}
