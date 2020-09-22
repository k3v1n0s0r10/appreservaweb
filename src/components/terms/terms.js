import React, { useState } from 'react'

import { showMessage } from "react-native-flash-message";

import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  Linking, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'

export default function Terms( { showTerms, setShowTerms, setDisableButton, registerInfo, navigation } ) {

  const [loading, setLoading] = useState(false)

  const onAcceptTerms = () => {

    const { name, cel, residence, id, email } = registerInfo

    setDisableButton(true)
    setLoading(true)
    fetch('https://api-gestion.mascentigrados.com/register', {
    method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: name,
        cel: cel,
        residence: residence,
        docid: id,
        email: email,
      })
    })
    .then(response => response.json())
    .then(user => {
      setDisableButton(false)
      setLoading(false)
      setShowTerms(false)
      if(user === 'failed_register'){
        showMessage({
          icon: 'info',
          type: 'info',
          message: 'El usuario ya esta registrado',
          duration: 3000,
          floating: true,
          titleStyle:{
            fontSize: 17
          }
        })
        setShowTerms(false)
      }else if(user === 'ready-register'){
        showMessage({
          icon: 'success',
          type: 'success',
          message: 'Tu registro se envió correctamente, espera a que aprueben tu ingreso',
          duration: 3000,
          floating: true,
          titleStyle:{
            fontSize: 17
          }
        })
        setShowTerms(false)
        navigation.navigate('SignIn')
      }else if(user === 'already-register'){
        showMessage({
          icon: 'warning',
          type: 'warning',
          message: 'Tu registro ya fue enviado',
          description: 'Podrás iniciar sesión en cuanto aprueben tu registro',
          duration: 3000,
          floating: true,
          titleStyle:{
            fontSize: 17
          }
        })
        setShowTerms(false)
      }else{
        showMessage({
          icon: 'success',
          type: 'success',
          message: 'Registrado con Éxito. Inicie sesión',
          duration: 3000,
          floating: true,
          titleStyle:{
            fontSize: 17
          }
        })
        setShowTerms(false)
        navigation.navigate('SignIn')
      }
      
    })
  }

  return (
    <Modal
      visible={showTerms}
      transparent={true}
    >
      <View style={styles.termsModal}>
        {
          loading
          ?<ActivityIndicator
            color='#FFF'
            size={
              Platform.OS === 'ios' ?'large' :70
            }
          />

          :<View style= {styles.termsContainer}>
            <Text style={styles.termsText}>
              Al presionar de 'De acuerdo' estas aceptando nuestras 
            </Text>

            <TouchableOpacity
              onPress={() => Linking.openURL('https://reservaweb.net/terminos-y-condiciones-y-politicas-de-privacidad.html')}
            >
              <Text style={[styles.termsText, {color: 'blue', textDecorationLine: 'underline'}]}>Políticas de Privacidad, términos y condiciones</Text>
            </TouchableOpacity>

            <View style={styles.termsButtons}>

              <TouchableOpacity
                onPress={() => setShowTerms(false)}
                style={[styles.termsButton, {backgroundColor: 'red'}]}
              >
                <Text style={{fontSize: 20, color: '#FFF'}}>No</Text>

              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.termsButton, {backgroundColor: 'green'}]}
                onPress={() => {
                  onAcceptTerms()
                }}
              >

                <Text style={{fontSize: 20, color:'#FFF'}}>De acuerdo</Text>

              </TouchableOpacity>
              
            </View>

          </View>
        }
        
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  termsModal:{
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#00000073',
    alignItems: 'center',
    justifyContent: 'center'
  },
  termsContainer:{
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: 300,
    alignItems: 'center',
    paddingTop: 30,
  },
  termsText:{
    textAlign: 'center',
    fontSize: 17
  },
  termsButtons:{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
  },
  termsButton:{
    alignItems: 'center',
    width: 120,
    paddingVertical: 5,
    borderRadius: 100,
  }
})
