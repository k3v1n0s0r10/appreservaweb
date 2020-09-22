import React, { useState } from 'react'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Modal 
} from 'react-native'

import { showMessage } from 'react-native-flash-message'

export default function CovidQuestions( { navigation, visible ,setShowModal, setShowCovidAlert, actualUser } ) {

  const [questionPosition, setQuestionPosition] = useState(0)

  const questions= [
    '¿Has tenido contacto en los últimos 14 días o vives con alguien sospechoso o confirmado de tener COVID-19?',
    '¿Tienes fiebre > 37,5°C hoy o en días previos?(2 o 3 días antes)',
    '¿Tienes malestar o dolor de garganta hoy o en días previos?(2 o 3 días antes)',
    '¿Tienes sensación de malestar general hoy o días previos? (2 o 3 días antes)',
    '¿Tienes sensación de fatiga o cansancio muscular?',
    '¿Tienes tos seca y persistente hoy o en días previos? (2 o 3 días antes)',
    '¿Tienes dificultad para respirar hoy o en días previos? (2 o 3 días antes)',
    '¿Tienes secreciones nasales o congestión nasal?',
    '¿Tienes pérdida del olfato y/o el gusto hoy o en días previos? (2 o 3 días antes)',
    '¿Tienes dolor de cabeza recurrente o espontáneo hoy o en días previos? (2 o 3 días antes)'
  ]

  const allQuestionsCorrect = () => {
    if(actualUser[1][1]){
      navigation.navigate('Switch', { actualUser: actualUser, places: actualUser[1]})
    }else{
      navigation.navigate('Schedule', { place: actualUser[1][0].place, actualUser: actualUser } )
    }
    showMessage({
      type: 'success',
      icon: 'success',
      message: 'Bienvenido',
      floating: true,
      style:{
        width: 200,
        top: 1,
        right: 1,
      }
    })
    setQuestionPosition(0)
    setShowModal(false)
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.covidModal}>

        <View style={styles.covidModalContainer}>

          <Image 
            source={require('../../img/logoCovid.jpeg')}
            style={styles.covidImage}
          />

          <Text style={styles.covidText}>
            {
              questions[questionPosition]
            }
          </Text>

          <View style={styles.covidButtons}>
            <TouchableOpacity
              activeOpacity={.6}
              onPress={() => {

                if(questionPosition < 9){
                  setQuestionPosition(questionPosition + 1)
                }else{
                  allQuestionsCorrect()
                }

              }}
              style={[styles.button, {backgroundColor: '#349697'}]}
            >
              <Text style={[styles.buttonText, {color: '#89f67a'}]}>No!</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={.6}
              onPress={() => {
                setQuestionPosition(0)
                setShowCovidAlert(true)
                setShowModal(false)
              }}
              style={[styles.button, {backgroundColor: '#89f67a'}]}
            >
              <Text style={[styles.buttonText, {color: '#349697'}]}>Si!</Text>
            </TouchableOpacity>
          </View>

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
    paddingVertical: 20,
    fontSize: hp('2.5%'),
  },
  covidButtons:{
    marginVertical: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button:{
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText:{
    fontSize: hp('4%'),
    fontWeight: 'bold',
    textShadowColor:'#585858',
    textShadowOffset:{width: 1, height: -1},
    textShadowRadius: 5,
  },
})

