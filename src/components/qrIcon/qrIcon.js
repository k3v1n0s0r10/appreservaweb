import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faQrcode } from '@fortawesome/free-solid-svg-icons'

export default function QrIcon( { navigation, color } ) {
  return (
    <View style={[styles.qrContainer, {borderColor: color}]}>
      <FontAwesomeIcon 
        icon={faQrcode}
        size={40}
        style={{color: color}}
        onPress={() => {
          navigation.navigate('QrScanner')
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  qrContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 100,
    borderWidth: 1,
  },
})