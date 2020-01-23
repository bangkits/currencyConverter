import React, { Component } from 'react';
import { StyleSheet, Alert, View, TextInput, Button, Picker, ActivityIndicator, AsyncStorage } from 'react-native';
import axios from 'axios';

export default class CurrConv extends Component {

  state = {
    currencyArr: {},
    baseAmount: null,
    targetCurrency: null,
    currencyValue: null,
    baseCurrencyArray: ['IDR', 'USD', 'GBP'],
    baseCurrency: 'IDR',
    targetCurrency: 'IDR'
  }

  componentWillMount() {
    this._getCurrency(this.state.baseCurrency);
    console.log(AsyncStorage);
  };

  _getCurrency(base) {
    try {
      axios.get('https://api.exchangeratesapi.io/latest?base=' + base).
        then(res => {
          console.log(res.data.rates.CAD);
          const currencyArr = res.data.rates;
          this.setState({
            currencyArr
          }, () => console.log(this.state.currencyArr));
        });
    } catch (error) {
      console.error(error);
    }
  };

  _updateBaseCurrency = baseCurrency => {
    this.setState({
      baseCurrency
    }, () => this._getCurrency(baseCurrency));
  };

  _updateBaseAmount = baseAmount => {
    const { currencyValue } = this.state;

    console.log(baseAmount, currencyValue);
    const targetAmount = this._countCurrency(baseAmount, currencyValue)
    console.log(targetAmount);

    this.setState({
      baseAmount,
      targetAmount
    });
  };

  _updateTargetCurrency = (targetCurrency, currencyValue) => {
    this.setState({
      targetCurrency,
      currencyValue
    })
  };

  _countCurrency = (baseAmount, currencyValue) => baseAmount * currencyValue;

  _renderBasePicker = currencyArr => (
    <Picker
      mode='dialog'
      style={{ marginHorizontal: 10 }}
      onValueChange={baseCurrency => this._updateBaseCurrency(baseCurrency)}>
      {
        Object.keys(currencyArr).map(data => {
          return (
            <Picker.Item label={data} value={data} />
          )
        })
      }
    </Picker>
  );

  _renderTargetPicker = currencyArr => (
    <Picker
      style={{ marginHorizontal: 10 }}
      onValueChange={targetCurrency => this._updateTargetCurrency(targetCurrency, currencyArr[targetCurrency])}
    >
      {
        Object.keys(currencyArr).map((data, index) => {
          return (
            <Picker.Item label={data} value={data} />
          );
        })
      }
    </Picker>
  );

  _renderBaseAmount = () => {
    const { baseAmount, currencyArr } = this.state;

    return (
      <View style={styles.form}>
        {this._renderBasePicker(currencyArr)}
        <TextInput
          placeholder='input amount'
          value={baseAmount}
          onChangeText={baseAmount => this._updateBaseAmount(baseAmount)}
        />
      </View>
    )
  };

  _renderTargetAmount = () => {
    const { targetAmount, currencyArr } = this.state;

    return (
      <View style={styles.form}>
        {this._renderTargetPicker(currencyArr)}
        <TextInput
          editable={false}
          placeholder='input amount'
          value={targetAmount}
        />
      </View>
    )
  };

  // _renderSelectedCurrencyList = () => {
  //   const { selectedCurrencyArr, baseCurrency, amount } = this.state;
  //   return (
  //     selectedCurrencyArr.map((data, index) => {
  //       return (
  //         <View style={{ justifyContent: 'flex-start' }}>
  //           <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  //             <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{data.string}</Text>
  //             <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{amount * data.value}</Text>
  //           </View>
  //           <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
  //             <Text> 1 {baseCurrency} = {data.value} {data.string}</Text>
  //             <Button
  //               title="delete"
  //               onPress={() => this._deleteCurrencyList(index)}
  //             />
  //           </View>
  //         </View>
  //       )
  //     })
  //   )
  // }

  // _deleteCurrencyList = index => {
  //   console.log(index);
  //   const { selectedCurrencyArr } = this.state;
  //   let tempArray = selectedCurrencyArr;
  //   tempArray.splice(index, 1);
  //   this.setState({
  //     selectedCurrencyArr: tempArray
  //   })
  // }

  _getLocalData = async () => {
    try {
      const value = await AsyncStorage.getItem('savedCurrencyList')
      // console.log(value);
      return value.PromiseValue;
    } catch (e) {
      console.log(e);
    }
  }

  _storeLocalData = async currencyListArray => {
    try {
      await AsyncStorage.setItem('savedCurrencyList', JSON.stringify(currencyListArray));
    } catch (error) {
      // Error saving data
    }
  };

  _addCurrency = () => {

    const { baseCurrency, targetCurrency, targetAmount, currencyValue } = this.state;
    this._storeLocalData();

    const currencyData = { baseCurrency, targetCurrency, targetAmount, currencyValue };

    this._storeLocalData(currencyData);

    const x = this._getLocalData();
    console.log(x);
    // console.log('currency list', currencyListArray);
  };

  render() {
    return (
      <View style={styles.container}>
        {this._renderBaseAmount()}
        {this._renderTargetAmount()}
        <Button
          title="Save Currency"
          onPress={() => this._addCurrency()}
        />
        {/* <View style={{ justifyContent: 'flex-start', borderRadius: 4, borderWidth: 2, marginVertical: 10, width: '100%', padding: 10 }}> */}
        {/* {this._renderSelectedCurrencyList()} */}
        {/* </View> */}
      </View>
    );
  };
}

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
