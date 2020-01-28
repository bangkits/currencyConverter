import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Button, Picker, ActivityIndicator, AsyncStorage, Text, ToastAndroid } from 'react-native';
import axios from 'axios';

const Separator = () => (
  <View style={styles.separator} />
);

export default class CurrConv extends Component {

  state = {
    currencyArr: {},
    baseAmount: '',
    targetAmount: '',
    currencyValue: 1,
    baseCurrencyArray: ['IDR', 'USD', 'GBP'],
    baseCurrency: 'IDR',
    targetCurrency: 'IDR'
  }

  componentDidMount() {
    this._getCurrency();
  };

  _getCurrency() {
    const { baseAmount, targetCurrency, baseCurrency } = this.state
    try {
      axios.get('https://api.exchangeratesapi.io/latest?base=' + baseCurrency).
        then(res => {
          let currencyArr = res.data.rates;
          let currencyValue = currencyArr[targetCurrency];
          let targetAmount = this._countCurrency(baseAmount, currencyValue);

          this.setState({
            currencyArr,
            currencyValue,
            targetAmount
          });
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
    const targetAmount = this._countCurrency(baseAmount, currencyValue);

    this.setState({
      baseAmount,
      targetAmount
    }, () => console.log(baseAmount));
  };

  _updateTargetCurrency = (targetCurrency, currencyValue) => {
    const { baseAmount } = this.state;

    let targetAmount = this._countCurrency(baseAmount, currencyValue);

    this.setState({
      targetCurrency,
      currencyValue,
      targetAmount
    });
  };

  _countCurrency = (baseAmount, currencyValue) => {
    if (baseAmount === '') {
      return 0;
    };

    return baseAmount * currencyValue;
  };

  _renderBasePicker = currencyArr => (
    <Picker
      selectedValue={this.state.baseCurrency}
      mode='dialog'
      style={{ width: 50 }}
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
      style={{ width: 50 }}
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
  );

  _renderBaseAmount = () => {
    const { baseAmount, currencyArr } = this.state;

    console.log(currencyArr);
    return (
      <View style={styles.form}>
        {
          currencyArr === {} ? this._renderLoading() : this._renderBasePicker(currencyArr)
        }
        <TextInput
          style={{ width: '100%' }}
          placeholder='input amount'
          value={baseAmount}
          onChangeText={baseAmount => this._updateBaseAmount(baseAmount)}
        />
      </View>
    )
  };

  _currencyFormat = num => num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

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
      ToastAndroid.show('Currency Saved!', ToastAndroid.SHORT);
    } catch (error) {
      console.log(error);
    }
  };

  _setCurrencyData = () => {
    const {
      baseCurrency,
      targetCurrency,
      baseAmount,
      targetAmount,
      currencyValue
    } = this.state;

    return ({
      baseCurrency,
      targetCurrency,
      baseAmount,
      targetAmount,
      currencyValue
    })
  };

  _addCurrency = async () => {
    const currencyData = this._setCurrencyData();
    const tempArray = await this._getLocalData();

    tempArray.push(currencyData);

    this._storeLocalData(tempArray)
  };

  _isDisabledSaveButton = (baseAmount, targetAmount) => (
    baseAmount == '' && targetAmount == 0
  );

  _renderSaveButton = () => {
    const { baseAmount, targetAmount } = this.state;

    return (
      <Button
        disabled={this._isDisabledSaveButton(baseAmount, targetAmount)}
        title="Save Currency"
        onPress={() => this._addCurrency()}
      />
    );
  };

  _renderNavigateButton = () => {
    const { navigation: { navigate } } = this.props;
    return (
      <Button
        title="Currency List"
        onPress={() => navigate('CurrencyList')}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this._renderBaseAmount()}
        {this._renderTargetAmount()}
        <Separator />
        <View style={styles.buttonWrapper}>
          {this._renderSaveButton()}
          {this._renderNavigateButton()}
        </View>
      </View>
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
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
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
