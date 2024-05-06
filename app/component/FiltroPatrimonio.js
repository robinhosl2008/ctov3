import * as React from 'react';
import { View } from 'react-native';
import { Searchbar } from 'react-native-paper';

const FiltroPatrimonio = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = query => setSearchQuery(query);

  return (
    <View>
        <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        />
    </View>
  );
};

export default FiltroPatrimonio;