import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Picker } from 'react-native';
import axios from 'axios';

export default class Content extends Component {

  state = {
    currencyArr: {},
    selectedCurrency: [],
    inputAmount: null,
    baseCurrencyArray: ['IDR', 'USD', 'GBP']
  }

  componentWillMount() {
    this.getCurrency();
  };

  getCurrency() {
    try {
      axios.get('https://api.exchangeratesapi.io/latest?base=IDR').
        then(res => {
          const currencyArr = res.data.rates;
          this.setState({
            currencyArr
          }, () => console.log(this.state.currencyArr));
        });
    } catch (error) {
      console.error(error);
    }
  }

  _updateInputAmount = inputAmount => {
    this.setState({
      inputAmount
    });
  };

  _saveCurrency = () => {
    const { currencyArr, inputAmount } = this.state;
    let tempArray = currencyArr;

    tempArray.push(inputAmount);

    this.setState({
      inputAmount: '',
      currencyArr: tempArray,
      language: ''
    }, () => console.log(this.state));
  }

  _renderForm = () => {
    const {
      inputAmount
    } = this.state;

    return (
      <View style={styles.form}>
        <TextInput placeholder='input amount' value={inputAmount} onChangeText={this._updateInputAmount} style={{ borderWidth: 1 }} />
        {/* <Button
          title="Save Currency"
          onPress={() => this._saveCurrency()}
        /> */}
      </View>
    )
  }

  _renderCurrencyData = () => {
    const {
      currencyArr
    } = this.state;

    return (
      <Picker
        selectedValue={this.state.language}
        style={{ height: 30, width: '100%' }}
        onValueChange={(itemValue, itemIndex) =>
          // this.setState({ language: itemValue }, () => console.log(language))
          console.log(itemValue, itemIndex)
        }>
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
        <View styles={{ flexDirection: 'row' }}>          
          {this._renderForm()}
          {this._renderCurrencyData()}
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
  },
  form: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 2,
    padding: 5
  }
});
