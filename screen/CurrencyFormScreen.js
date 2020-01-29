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
    targetCurrency: 'IDR',
    isSubmit: false
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
          }, this._cek);
        });
    } catch (error) {
      console.error(error);
    };
  };

  _updateBaseCurrency = baseCurrency => {
    this.setState({
      baseCurrency
    }, this._getCurrency);
  };

  _updateBaseAmount = baseAmount => {
    const { currencyValue } = this.state;
    const targetAmount = this._countCurrency(baseAmount, currencyValue);

    this.setState({
      baseAmount,
      targetAmount
    });
  };

  _updateTargetCurrency = targetCurrency => {
    const { baseAmount, currencyArr } = this.state;
    const currencyValue = currencyArr[targetCurrency]
    const targetAmount = this._countCurrency(baseAmount, currencyValue);

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

  _renderBasePicker = () => {
    const { baseCurrency, currencyArr } = this.state;

    return (
      <Picker
        selectedValue={baseCurrency}
        mode='dialog'
        style={{ width: 100 }}
        onValueChange={this._updateBaseCurrency}>
        {
          Object.keys(currencyArr).map((data, index) => {
            return (
              <Picker.Item label={data} value={data} key={index} />
            )
          })
        }
      </Picker>
    );
  };

  _renderTargetPicker = () => {
    const { currencyArr, targetCurrency } = this.state;

    return (
      <Picker
        selectedValue={targetCurrency}
        style={{ width: 100 }}
        onValueChange={this._updateTargetCurrency}
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
  };

  _renderLoading = () => (
    <ActivityIndicator size="small" color="black" />
  );

  _renderBaseAmount = () => {
    const { baseAmount } = this.state;

    return (
      <View style={styles.form}>
        {this._renderBasePicker()}
        <TextInput
          style={styles.textAmount}
          placeholder='input amount'
          value={baseAmount}
          onChangeText={this._updateBaseAmount}
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
        <Text style={styles.textAmount} >
          {targetAmount && this._currencyFormat(targetAmount)}
        </Text>
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
      this.setState({
        isSubmit: false
      }), 3000);
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

  _renderSaveButton = () => {
    const { baseAmount, targetAmount } = this.state;
    const _isDisabledSaveButton = baseAmount == '' && targetAmount == 0;

    return (
      <Button
        disabled={_isDisabledSaveButton}
        title="Save Currency"
        onPress={this._addCurrency}
      />
    );
  };

  render() {
    const { isSubmit } = this.state;
    return (
      <View style={styles.container}>
        {this._renderBaseAmount()}
        {this._renderTargetAmount()}
        {isSubmit ? <Text> Currency Saved !</Text> : <Separator />}
        {this._renderSaveButton()}

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
  }
});
