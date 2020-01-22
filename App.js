import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Picker, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Content from './Content.js';

export default class CurrConv extends Component {


  state = {
    currencyArr: {},
    selectedCurrencyArr: [],
    selectedCurrency: '',
    amount: null,
    baseCurrencyArray: ['IDR', 'USD', 'GBP'],
    baseCurrency: 'IDR'
  }

  componentWillMount() {
    this.getCurrency();
  };

  getCurrency() {
    try {
      axios.get('https://api.exchangeratesapi.io/latest?base=IDR').
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
  }

  _updateInputAmount = amount => {
    this.setState({
      amount
    });
  };

  _saveCurrency = () => {
    const { currencyArr, amount } = this.state;
    let tempArray = currencyArr;

    tempArray.push(amount);

    this.setState({
      amount: '',
      currencyArr: tempArray,
      language: ''
    }, () => console.log(this.state));
  }

  _renderForm = () => {
    const {
      amount,
      baseCurrencyArray
    } = this.state;

    return (
      <View style={styles.form}>
        <Picker
          mode='dialog'
          style={{ marginHorizontal: 10 }}
          onValueChange={baseCurrency => this.setState({ baseCurrency })}
        >
          {
            baseCurrencyArray.map(data => {
              return (
                <Picker.Item label={data} value={data} />
              )
            })
          }
        </Picker>
        <TextInput
          placeholder='input amount'
          value={amount}
          onChangeText={amount => this.setState({
            amount
          })} />
      </View>
    )
  }

  _renderSelectedCurrencyList = () => {
    const { selectedCurrencyArr, baseCurrency, amount } = this.state;
    return (
      selectedCurrencyArr.map((data, index) => {
        return (
          <View style={{ justifyContent: 'flex-start' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{data.string}</Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{amount * data.value}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
              <Text> 1 {baseCurrency} = {data.value} {data.string}</Text>
              <Button
                title="delete"
                onPress={() => this._deleteCurrencyList(index)}
              />
            </View>
          </View>
        )
      })
    )
  }

  _deleteCurrencyList = index => {
    console.log(index);
    const { selectedCurrencyArr } = this.state;
    let tempArray = selectedCurrencyArr;
    tempArray.splice(index, 1);
    this.setState({
      selectedCurrencyArr: tempArray
    })
  }

  _addCurrency = () => {
    const { selectedCurrency, selectedCurrencyArr, currencyArr } = this.state;
    const tempArray = selectedCurrencyArr;

    tempArray.push({
      string: selectedCurrency,
      value: currencyArr[selectedCurrency]
    });

    this.setState({ selectedCurrencyArr: tempArray });
  }

  _renderCurrencyData = () => {
    const { currencyArr } = this.state;
    return (
      <Picker
        style={{ height: 30, width: '100%', marginVertical: 5 }}
        onValueChange={selectedCurrency => this.setState({ selectedCurrency })}
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
  }

  render() {
    return (
      <View style={styles.container}>
        {this._renderForm()}
        {this._renderCurrencyData()}
        <Button
          title="Save Currency"
          onPress={() => this._addCurrency()}
        />
        <View style={{ justifyContent: 'flex-start', borderRadius: 4, borderWidth: 2, marginVertical: 10, width: '100%', padding: 10 }}>
          {this._renderSelectedCurrencyList()}
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
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
