import React from 'react';
import { StatusBar,View,Text, SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator} from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import AppNavigator from './app/navigation/AppNavigator';
// import ModalLoading from './app/component/ModalLoading';
import SplashScreen from  "react-native-splash-screen";
// import Checking from './app/v3/screen/Checking';  
// import Terminais from './app/v3/screen/Terminais';
// import Garagens from './app/v3/screen/Garagens'; 
// import Patrimônios from './app/v3/screen/Patrimonios';
import HeaderStackNavigator from './app/v3/components/HeaderStackNavigator';
import LoginScreen_v3 from './app/v3/screen/LoginScreen_v3';

// Redux
import { Provider } from "react-redux";
import store from './app/state/store';
 
/* const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'darkorange',
    accent: 'yellow',
    statusBar: '#f28500'
  },
};

// Define o BackgroundColor da StatusBar
StatusBar.setBackgroundColor(theme.colors.statusBar);  */



function App() {

  React.useEffect(() => { 
    SplashScreen.hide();
  }); 
 
 

  return (
    <>
        {/* <PaperProvider theme={theme}> 
          <Provider store={store}> 
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
            <ModalLoading/>
          </Provider>
        </PaperProvider> */}
        
        <Provider store={store}>
          <SafeAreaProvider>
            <NavigationContainer>
              <HeaderStackNavigator/>
            </NavigationContainer> 
          </SafeAreaProvider>
        </Provider>
      </>
  )
}

export default App;