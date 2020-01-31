import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

class FooterWidget extends Component {

  render() {
    return (
      <View style={styles.wrapperBox}>
          <TouchableOpacity onPress={this.props.onPressAdd} style={styles.addButton}>
            <Text style={styles.mainText}>Add Currency</Text>
          </TouchableOpacity>
      </View>
    )
  } 
}

const styles = StyleSheet.create({
  wrapperBox: {
    flexDirection: 'row',
    width: '100%',
    height: 55,
    alignSelf: 'flex-end',
    justifyContent: 'space-around',
    alignContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#607D8B',
    borderTopStartRadius: 5,
    borderTopEndRadius: 5
  },
  addButton: {
    width: '80%',
    justifyContent: 'center',
    backgroundColor: '#26C6DA',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 15
  },
  mainText: {
    fontSize: 18,
    fontWeight: '400',
    alignSelf: 'center'
  }
});

export default FooterWidget;