import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, AsyncStorage, Text, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';

const Separator = () => (
  <View style={styles.separator} />
);

export default class CurrConv extends Component {

  static navigationOptions = {
    title: 'Currency List',
  };

  state = {
    currencyArr: {},
    isSubmit: false
  }

  componentDidMount() {
    this._getCurrency();
  };

  _getCurrency() {
    try {
      axios.get('https://api.exchangeratesapi.io/latest?base=IDR').
        then(res => {
          let currencyArr = res.data.rates;

          this.setState({ currencyArr });
        });
    } catch (error) {
      console.error(error);
    };
  };

  _renderContent = data => {
    const { item, index} = data;
    return (
        <View style={styles.listWrapper} key={index}>
            <Text style={styles.lowerContentFont}>{item}</Text>
            <TouchableOpacity onPress={this._addCurrency(item)}>
              <Text>Add</Text>
            </TouchableOpacity>
        </View>
    );
  };

  _renderListCurrency = () => {
    const { currencyArr } = this.state;
    return (
      <ScrollView>
        {Object.keys(currencyArr).map((item, index) => {
          const value = currencyArr[item];
          return this._renderContent({item, value, index});
        })}
      </ScrollView>
    )
  };

  _renderLoading = () => (
    <ActivityIndicator size="small" color="black" />
  );

  _currencyFormat = num => num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

  _getLocalData = async () => {
    try {
      const value = await AsyncStorage.getItem('savedCurrencyList');
      if (value != null) {
        return JSON.parse(value);
      };
    } catch (e) {
      console.log(e);
    }
  };

  _storeLocalData = async currencyListArray => {
    try {
      await AsyncStorage.setItem('savedCurrencyList', JSON.stringify(currencyListArray));
      await AsyncStorage.setItem('currencyList', JSON.stringify(this.state.currencyArr));

      this.setState({
        isSubmit: true
      },
        this._hideSnackBar
      );
    } catch (error) {
      console.log(error);
    }
  };

  _hideSnackBar = () => {
    setTimeout(() =>
      this.props.navigation.goBack(), 1000);
  };

  _addCurrency = item => async () => {
    const tempArray = await this._getLocalData();

    tempArray.push(item);

    this._storeLocalData(tempArray);
  };


  render() {
    return (
      <View style={styles.container}>
        {this._renderListCurrency()}
      </View>
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },
  form: {
    borderColor: 'black',
    padding: 4,
    borderWidth: 1,
    borderRadius: 2,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  textAmount: {
    marginLeft: 10,
    width: '100%'
  },
  listWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    margin: 5,
    padding: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    borderColor: 'black'
},
lowerContentFont: {
    fontSize: 20,
    fontWeight: 'bold'
}
});
