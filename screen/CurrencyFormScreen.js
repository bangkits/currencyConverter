import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Button, Picker, ActivityIndicator, AsyncStorage, Text } from 'react-native';
import axios from 'axios';

export default class CurrConv extends Component {

  state = {
    currencyArr: {},
    baseAmount: undefined,
    targetAmount: undefined,
    currencyValue: 1,
    baseCurrencyArray: ['IDR', 'USD', 'GBP'],
    baseCurrency: 'IDR',
    targetCurrency: 'IDR',
    savedCurrencyList: []
  }

  componentWillMount() {
    this._getCurrency(this.state.baseCurrency);
    this._getLocalData();
  };

  _getCurrency(base) {
    try {
      axios.get('https://api.exchangeratesapi.io/latest?base=' + base).
        then(res => {
          const currencyArr = res.data.rates;
          this.setState({
            currencyArr,
            currencyValue: currencyArr[this.state.targetCurrency]
          }, () => console.log(this.state.currencyValue));
        });
    } catch (error) {
      console.error(error);
    };
  };

  _updateBaseCurrency = baseCurrency => {
    this.setState({
      baseCurrency
    }, () => this._getCurrency(baseCurrency));
  };

  _updateBaseAmount = baseAmount => {
    const { currencyValue } = this.state;
    const targetAmount = this._countCurrency(baseAmount, currencyValue)

    this.setState({
      baseAmount,
      targetAmount
    });
  };

  _updateTargetCurrency = (targetCurrency, currencyValue) => {
    this.setState({
      targetCurrency,
      currencyValue
    });
  };

  _countCurrency = (baseAmount, currencyValue) => baseAmount * currencyValue;

  _renderBasePicker = currencyArr => (
    <Picker
      selectedValue={this.state.baseCurrency}
      mode='dialog'
      style={{ marginHorizontal: 10 }}
      onValueChange={baseCurrency => this._updateBaseCurrency(baseCurrency)}>
      {
        Object.keys(currencyArr).map((data, index) => {
          return (
            <Picker.Item label={data} value={data} key={index} />
          )
        })
      }
    </Picker>
  );

  _renderTargetPicker = currencyArr => (
    <Picker
      selectedValue={this.state.targetCurrency}
      style={{ marginHorizontal: 10 }}
      onValueChange={targetCurrency => this._updateTargetCurrency(targetCurrency, currencyArr[targetCurrency])}
    >
      {
        Object.keys(currencyArr).map((data, index) => {
          return (
            <Picker.Item label={data} value={data} key={index} />
          );
        })
      }
    </Picker>
  );

  _renderLoading = () => (
    <ActivityIndicator size="small" color="black" />
  )
  _renderBaseAmount = () => {
    const { baseAmount, currencyArr } = this.state;

    return (
      <View style={styles.form}>
        {
          currencyArr === {} ? this._renderLoading() : this._renderBasePicker(currencyArr)
        }
        <TextInput
          placeholder='input amount'
          value={baseAmount}
          onChangeText={baseAmount => this._updateBaseAmount(baseAmount)}
        />
      </View>
    )
  };

  _currencyFormat = num => {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  _renderTargetAmount = () => {
    const { targetAmount, currencyArr } = this.state;

    return (
      <View style={styles.form}>
        {this._renderTargetPicker(currencyArr)}
        <Text>{targetAmount && this._currencyFormat(targetAmount)}</Text>
      </View>
    )
  };

  _getLocalData = async () => {
    let savedCurrencyList = [];
    try {
      const value = await AsyncStorage.getItem('savedCurrencyList');

      if (value != null) {
        savedCurrencyList = JSON.parse(value);
        this.setState({
          savedCurrencyList
        });
      };
    } catch (e) {
      console.log(e);
    }
  };

  _storeLocalData = async currencyListArray => {
    try {
      await AsyncStorage.setItem('savedCurrencyList', JSON.stringify(currencyListArray));
    } catch (error) {
      // Error saving data
    }
  };

  _addCurrency = () => {

    const { baseCurrency, targetCurrency, baseAmount, targetAmount, currencyValue, savedCurrencyList } = this.state;
    const currencyData = { baseCurrency, targetCurrency, baseAmount, targetAmount, currencyValue };

    let tempArray = savedCurrencyList;
    console.log(savedCurrencyList);

    tempArray.push(currencyData);
    console.log('temp array', tempArray);
    this.setState({
      savedCurrencyList: tempArray
    }, () => this._storeLocalData(savedCurrencyList));
  };

  render() {
    const { navigation: { navigate } } = this.props;

    return (
      <View style={styles.container}>
        {this._renderBaseAmount()}
        {this._renderTargetAmount()}
        <Button
          title="Save Currency"
          onPress={() => this._addCurrency()}
        />
        <Button
          title="Saved Currency List Page"
          onPress={() => navigate('CurrencyList')}
        />
      </View>
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 20
  },
  form: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 2,
    padding: 5,
    marginVertical: 5,
    flexDirection: 'row',
    width: '100%'
  }
});
