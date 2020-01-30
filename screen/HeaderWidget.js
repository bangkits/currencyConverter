import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Picker, Icon } from 'native-base';

class HeaderWidget extends Component {
  
  state = {
    currency: 'USD'
  };
  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.mainText}>Hello, Budi</Text>
        <View style={styles.formContainer}>
        
            <TextInput
              type="number"
              placeholder="Input Amount..."
              placeholderTextColor="#616161"
              style={styles.formInput}
            />
            {/* <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={styles.formDropdown}
              placeholder="Select your SIM"
              placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
              selectedValue={this.state.currency}
              // onValueChange={this.onValueChange2.bind(this)}
            >
              <Picker.Item label="USD" value="USD" />
              <Picker.Item label="IDR" value="IDR" />
            </Picker> */}
            <Text style={styles.currencyText}>{this.state.currency}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginBottom: 10,
    padding: 20,
    backgroundColor: "#607D8B",
    borderBottomStartRadius: 5,
    borderBottomEndRadius: 5
  },
  mainText: {
    alignSelf: 'center',
    color: "#FAFAFA",
    fontSize: 24,
    fontWeight: '400',
    marginVertical: 10
  },
  currencyText: {
    color: '#212121',
    fontSize: 40,
    fontWeight: '400'
  },
  formContainer:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 80,
    marginTop: 5,
    padding: 10,
    backgroundColor: '#26C6DA',
    borderRadius: 15
  },
  formInput: { 
    height: 40,
    width: 170,
    borderColor: '#212121',
    borderBottomWidth: 2,
    fontSize: 20
  },
  formDropdown: {
    width: 120,
    height: 40,
    borderColor: '#212121',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#FAFAFA'
  }
});

export default HeaderWidget;