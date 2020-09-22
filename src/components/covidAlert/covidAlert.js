import React from 'react'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { 
  View, 
  Text, 
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native'

export default function CovidAlert( { visible, setShowCovidAlert } ) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
       <View style={styles.covidModal}>

        <View style={styles.covidModalContainer}>

          <Image 
            source={require('../../img/doctorCovid.png')}
            style={styles.covidImage}
          />

          <Text style={styles.covidText}>Hola!</Text>
          <Text style={styles.covidText}>Si presentas sintomatología por favor evita visitar lugares concurridos.</Text>
          <Text style={styles.covidText}>Evitemos juntos la propagación del virus</Text>

            <TouchableOpacity
              activeOpacity={.6}
              onPress={() => {
                setShowCovidAlert(false)
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Ok</Text>
            </TouchableOpacity>

        </View>

      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  covidModal:{
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#00000073',
    alignItems: 'center',
    justifyContent: 'center'
  },
  covidModalContainer:{
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: wp('70%'),
    alignItems: 'center'
  },
  covidImage:{
    height: hp('30%'),
    width: hp('30%'),
    borderRadius: 1000,
    marginTop: -100,
  },
  covidText:{
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    fontSize: hp('3%'),
    fontFamily: 'Raleway-Italic'
  },
  covidButtons:{
    marginVertical: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button:{
    marginVertical: 20,
    paddingHorizontal: 40,
    paddingVertical: 5,
    borderRadius: 100,
    backgroundColor: '#fffce3',
    borderWidth: 1,
    borderColor: '#ed7548'

  },
  buttonText:{
    fontSize: hp('4%'),
    color: '#ed7548'
  },
})

