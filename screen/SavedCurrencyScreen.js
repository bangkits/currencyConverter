import React, { Component } from 'react';
import { StyleSheet, View, Text, AsyncStorage, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import HeaderWidget from './HeaderWidget';
import FooterWidget from './FooterWidget';

const Separator = () => (
    <View style={styles.separator} />
);
class SavedCurrency extends Component {

    state = {
        currencyValue: 0,
        baseCurrency: 'IDR',
        savedCurrencyList: [],
        currencyArr: [],
        baseAmount: 1,
        isEdit: false
    };

    static navigationOptions = {
        title: 'Currency Converter App',
    };

    componentDidMount() {
        const { navigation } = this.props;
        this._getLocalData();
 
        //Adding an event listner om focus
        //So whenever the screen will have focus it will set the state to zero
        this.focusListener = navigation.addListener('didFocus', async () => {
            this._getLocalData();
        });
    };

    componentWillUnmount() {
        // Remove the event listener before removing the screen from the stack
        this.focusListener.remove();
    };

    _changeAmount = (value) => {
        this.setState({ baseAmount: value });
    };

    _editList = () => {
        this.setState({ isEdit: !this.state.isEdit })
    }

    _currencyFormat = num => num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    _currencyFormatIDR = num => num.toFixed(5).replace(/(\d)(?=(\d{5})+(?!\d))/g, '$1,');

    _renderSavedCurrencyList = () => {
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
        const { baseCurrency, currencyArr } = this.state;
        return (
            <View style={styles.upperContent}>
                <Text> 1 {baseCurrency} = {this._currencyFormatIDR(currencyArr[data])} {data}</Text>
                <TouchableOpacity onPress={() => this._deleteCurrencyList(index)}>
                    <Ionicons name='ios-close-circle-outline' size={18} color='red' />
                </TouchableOpacity>
            </View>
        );
    };

    _renderLowerContent = (data) => {
        const { baseAmount, baseCurrency, currencyArr } = this.state;
        const countedCurrency = this._countCurrency(baseAmount, currencyArr[data]);

        return (
            <View style={styles.lowerContent}>
                <Text style={styles.lowerContentFont}>{baseAmount} ({baseCurrency})</Text>
                <Text style={styles.lowerContentFont}> = </Text>
                <Text style={styles.lowerContentFont}>{this._currencyFormat(countedCurrency)} ({data})</Text>
            </View>
        );
    };

    _countCurrency = (baseAmount, currencyValue) => {
        if (baseAmount === '') {
          return 0;
        };
    
        return baseAmount * currencyValue;
    };

    _deleteCurrencyList = index => {
        const { savedCurrencyList } = this.state;
        let tempArray = savedCurrencyList;

        tempArray.splice(index, 1);

        this.setState({
            savedCurrencyList: tempArray
        }, this._storeLocalData);
    };

    _storeLocalData = async () => {
        const { savedCurrencyList, currencyArr } = this.state;

        try {
            await AsyncStorage.setItem('savedCurrencyList', JSON.stringify(savedCurrencyList));
            await AsyncStorage.setItem('currencyList', JSON.stringify(currencyArr));
        } catch (error) {
            // Error saving data
            console.log(error);
        }
    };

    _renderSeparator = array => array.length > 0 && <Separator />

    _getLocalData = async () => {
        try {
            const savedCurrency = await AsyncStorage.getItem('savedCurrencyList');
            const currencyList = await AsyncStorage.getItem('currencyList');

            if (savedCurrency != null) {
                this.setState({
                    currencyArr: JSON.parse(currencyList),
                    savedCurrencyList: JSON.parse(savedCurrency)
                });
            } else {
                this._storeLocalData();
            }
        } catch (e) {
            console.log(e);
        }
    };

    _navigateToForm = () => {
        this.props.navigation.navigate('CurrencyForm');
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderWidget onChangeAmount={this._changeAmount}/>
                <ScrollView>
                    {this._renderSavedCurrencyList()}
                </ScrollView>
                <FooterWidget onPressAdd={this._navigateToForm} />
            </View>
        );
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'space-between'
    },
    listWrapper: {
        justifyContent: 'flex-start',
        margin: 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        borderColor: 'black'
    },
    currencyListWrapper: {

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
});

export default SavedCurrency;
