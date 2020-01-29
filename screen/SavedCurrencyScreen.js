import React, { Component } from 'react';
import { StyleSheet, View, Text, AsyncStorage, TouchableOpacity, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import HeaderWidget from './HeaderWidget';
import FooterWidget from './FooterWidget';

const Separator = () => (
    <View style={styles.separator} />
);
class SavedCurrency extends Component {

    state = {
        targetAmount: undefined,
        currencyValue: 0,
        baseCurrency: '',
        targetCurrency: '',
        savedCurrencyList: []
    };

    // static navigationOptions = ({ navigation }) => {
    //     return {
    //         headerRight: () => (
    //             <TouchableOpacity onPress={() => navigation.navigate('CurrencyForm')} style={{ marginRight: 10 }}>
    //                 <Ionicons name='ios-add' size={36} color='white' />
    //             </TouchableOpacity >
    //         )
    //     }
    // };

    static navigationOptions = {
        title: 'Currency Converter App',
    };

    componentDidMount() {
        const { navigation } = this.props;
        this._storeLocalData();

        
        //Adding an event listner om focus
        //So whenever the screen will have focus it will set the state to zero
        this.focusListener = navigation.addListener('didFocus', async () => {
            this.setState({
                savedCurrencyList: await this._getLocalData()
            });
        });
    };

    componentWillUnmount() {
        // Remove the event listener before removing the screen from the stack
        this.focusListener.remove();
    }

    _currencyFormat = num => num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

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
        }, this._storeLocalData);
    };

    _storeLocalData = async () => {
        const { savedCurrencyList } = this.state;

        try {
            await AsyncStorage.setItem('savedCurrencyList', JSON.stringify(savedCurrencyList));
        } catch (error) {
            // Error saving data
            console.log(error);
        }
    };

    _renderSeparator = array => array.length > 0 && <Separator />

    _getLocalData = async () => {
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

    _navigateToForm = () => {
        this.props.navigation.navigate('CurrencyForm');
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderWidget />
                {this._renderSavedCurrencyList()}
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
});

export default SavedCurrency;
