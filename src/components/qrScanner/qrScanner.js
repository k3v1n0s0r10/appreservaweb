import React, { useEffect, useState } from 'react'

import QRCodeScanner from 'react-native-qrcode-scanner';

import { useRoute } from "@react-navigation/native";

import { 
  
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Linking, 
  Image, 
  Modal
  
} from 'react-native'

export default function QrScanner( { navigation } ) {

  const actualRoute = useRoute()

  const [ showModal, setShowModal ] = useState(true)
  
  const onReadQr = (e) => {
    Linking.openURL(e.data).catch(err =>
      console.error('An error occured', err)
    );  
  }

  return (
    <View style={{flexGrow: 1}}>
      <Modal 
        visible={showModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.qrModal}>
          <View style={styles.qrModalContainer}>
            <Image 
              style={styles.modalImg}
              source={require('../../img/qrImg.png')}
            />
            <Text
              style={{fontSize: 20, marginHorizontal: 10}}
            >
              Este lector QR redirige a sitios web.
            </Text>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={styles.goBack}
            >
              <Text style={styles.goBackText}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{flexGrow: 1, alignItems: 'center'}}>

        <QRCodeScanner 
          onRead={onReadQr}
        />

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.goBack}
          >
            <Text style={styles.goBackText}>Volver</Text>
          </TouchableOpacity>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  goBack: {
    marginVertical: 50,
    backgroundColor: '#eb9931',
    paddingHorizontal: 30,
    padding: 10,
    borderRadius: 20,
  },  
  goBackText: {
    color: '#FFF',
    fontSize: 20,
  },
  qrModal:{
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#00000073',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  qrModalContainer: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
  },
  modalImg:{
    height: 320,
    width: 220,
    marginHorizontal: 20,
    marginVertical: 20,
  }
})
