import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import CurrencyFormScreen from './screen/CurrencyFormScreen.js';
import CurrencyListScreen from './screen/SavedCurrencyScreen.js';

const MainNavigator = createStackNavigator(
  {
    CurrencyForm: CurrencyFormScreen,
    CurrencyList: CurrencyListScreen,
  },
  {
    initialRouteName: 'CurrencyList',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#607D8B',
        shadowColor: 'transparent',
        elevation: 0,
        borderBottomWidth: 0
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

const App = createAppContainer(MainNavigator);

export default App;