import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { DataTable } from 'react-native-paper';


const Table = (props) => {

    

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title style={styles.tableTitleContainer}><Text style={styles.tableTitleText}>Técnico</Text></DataTable.Title>
        <DataTable.Title style={styles.tableTitleContainer}><Text style={styles.tableTitleText}>Patrimônio</Text></DataTable.Title>
        <DataTable.Title style={styles.tableTitleContainer}><Text style={styles.tableTitleText}>Data</Text></DataTable.Title>
        <DataTable.Title style={styles.tableTitleContainer}><Text style={styles.tableTitleText}>Recebido ou entregue a:</Text></DataTable.Title>
      </DataTable.Header>

      <DataTable.Row>
        <DataTable.Cell><Text  style={styles.tabelCell}>William Soares</Text></DataTable.Cell>
        <DataTable.Cell><Text style={styles.tabelCell}>P000300</Text></DataTable.Cell>
        <DataTable.Cell><Text style={styles.tabelCell}>02/03/2023</Text></DataTable.Cell>
        <DataTable.Cell><Text style={styles.tabelCell}>Pedro Senna</Text></DataTable.Cell>
      </DataTable.Row>


      <DataTable.Pagination
        page={1}
        numberOfPages={3}
        onPageChange={(page) => console.log('mudou a pagina')}
        label="1 - 3"
        optionsPerPage={[2,3,4]} 
        itemsPerPage={[2,3,4]}
        setItemsPerPage={() => console.log('mudou pagina')}
        showFastPagination
        optionsLabel={'Rows per page'}
      />
    </DataTable>
  );
}

const styles = StyleSheet.create({
    tableTitleContainer:{
        paddingLeft:5
    },
    tableTitleText:{
        fontSize:16,
        fontWeight:'bold',
        color:'black',
        paddingLeft:20
    },
    tabelCell:{
        fontSize:14
    }
});

export default Table;