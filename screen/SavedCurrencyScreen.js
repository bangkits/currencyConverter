import React, { Component } from 'react';
import { StyleSheet, View, Text, AsyncStorage, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Separator = () => (
    <View style={styles.separator} />
);
class SavedCurrency extends Component {
    state = {
        savedCurrencyList: [],
        targetAmount: undefined,
        currencyValue: 0,
        baseCurrency: '',
        targetCurrency: '',
        savedCurrencyList: []
    }

    async componentDidMount() {
        this.setState({
            savedCurrencyList: await this._getLocalData()
        });
    };

    _currencyFormat = num => {
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    };

    __renderSavedCurrencyList = () => {
        const { savedCurrencyList } = this.state;

        return (
            savedCurrencyList.map((data, index) => {
                return (
                    <View style={styles.listWrapper} key={index}>
                        {this._renderUpperContent(data, index)}
                        <Separator />
                        {this._renderLowerContent(data)}
                    </View>
                );
            })
        );
    };

    _renderUpperContent = (data, index) => {
        const { baseCurrency, targetCurrency, currencyValue } = data;

        return (
            <View style={styles.upperContent}>
                <Text> 1 {baseCurrency} = {this._currencyFormat(currencyValue)} {targetCurrency}</Text>
                <TouchableOpacity onPress={() => this._deleteCurrencyList(index)}>
                    <Ionicons name='ios-close-circle-outline' size={18} color='red' />
                </TouchableOpacity>
            </View>
        );
    };

    _renderLowerContent = data => {
        const { baseCurrency, targetCurrency, baseAmount, targetAmount } = data;

        return (
            <View style={styles.lowerContent}>
                <Text style={styles.lowerContentFont}>{baseAmount} ({baseCurrency})</Text>
                <Text style={styles.lowerContentFont}> = </Text>
                <Text style={styles.lowerContentFont}>{this._currencyFormat(targetAmount)} ({targetCurrency})</Text>
            </View>
        );
    }

    _deleteCurrencyList = index => {
        const { savedCurrencyList } = this.state;
        let tempArray = savedCurrencyList;

        tempArray.splice(index, 1);

        this.setState({
            savedCurrencyList: tempArray
        }, () => this._storeLocalData(savedCurrencyList));
    };

    _storeLocalData = async currencyListArray => {
        try {
            await AsyncStorage.setItem('savedCurrencyList', JSON.stringify(currencyListArray));
        } catch (error) {
            // Error saving data
        }
    };

    _renderSeparator = array => array.length > 0 && <Separator />

    _getLocalData = async () => {
        let savedCurrencyList = [];
        try {
            const value = await AsyncStorage.getItem('savedCurrencyList')
            if (value != null) {
                return JSON.parse(value);
            };
            return value;
        } catch (e) {
            console.log(e);
        }
    };

    render() {
        return (
            <View style={styles.container}>
                {this.__renderSavedCurrencyList()}
            </View>
        );
    };
};

export default SavedCurrency;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    listWrapper: {
        justifyContent: 'flex-start',
        margin: 5,
        paddingHorizontal: 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        borderColor: 'black'
    },
    upperContent: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5
    },
    lowerContent: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    separator: {
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    lowerContentFont: {
        fontSize: 20,
        fontWeight: 'bold'
    }
})