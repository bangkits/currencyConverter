import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import CurrencyFormScreen from './screen/CurrencyFormScreen.js';
import CurrencyListScreen from './screen/SavedCurrencyScreen.js';

const MainNavigator = createStackNavigator({
  CurrencyForm: CurrencyFormScreen,
  CurrencyList: CurrencyListScreen,
});

const App = createAppContainer(MainNavigator);

export default App;