import React, { Component } from 'react';
import { View, Text, AsyncStorage, Button, Fragment } from 'react-native';

class SavedCurrency extends Component {
    state = {
        savedCurrencyList: [],
        targetAmount: undefined,
        currencyValue: 0,
        baseCurrency: '',
        targetCurrency: '',
        savedCurrencyList: []
    }

    componentDidMount() {
        this._getLocalData();
    };

    _currencyFormat = num => {
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    };

    __renderSavedCurrencyList = () => {
        const { savedCurrencyList } = this.state;

        return (
            savedCurrencyList.map((data, index) => {
                const { baseCurrency, targetCurrency, baseAmount, targetAmount, currencyValue } = data;
                return (
                    <View style={{ justifyContent: 'flex-start', margin: 5 }} key={index}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{baseCurrency} : </Text>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{baseAmount}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{targetCurrency} : </Text>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{this._currencyFormat(targetAmount)}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                            <Text> 1 {baseCurrency} = {this._currencyFormat(currencyValue)} {targetCurrency}</Text>
                            <Button
                                title="delete"
                                onPress={() => this._deleteCurrencyList(index)}
                            />
                        </View>
                    </View>
                );
            })
        );
    };

    _deleteCurrencyList = index => {
        const { savedCurrencyList } = this.state;
        let tempArray = savedCurrencyList;

        tempArray.splice(index, 1);

        this.setState({
            savedCurrencyList: tempArray
        }, () => this._storeLocalData(savedCurrencyList));
    }

    _storeLocalData = async currencyListArray => {
        try {
            await AsyncStorage.setItem('savedCurrencyList', JSON.stringify(currencyListArray));
        } catch (error) {
            // Error saving data
        }
    };

    _getLocalData = async () => {
        let savedCurrencyList = [];
        try {
            const value = await AsyncStorage.getItem('savedCurrencyList')
            if (value != null) {
                savedCurrencyList = JSON.parse(value);
                this.setState({
                    savedCurrencyList
                });
            };
            return value;
        } catch (e) {
            console.log(e);
        }
    };

    render() {
        return (
            <View>
                {this.__renderSavedCurrencyList()}
            </View>
        );
    };
};

export default SavedCurrency;