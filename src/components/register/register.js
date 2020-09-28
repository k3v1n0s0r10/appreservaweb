import React, { useEffect, useState } from 'react'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import { faIdCard, faMobileAlt, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { faUser, faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { Picker } from '@react-native-community/picker'

import SelectResidence from '../selectResidence/selectResidence'
import QrIcon from '../qrIcon/qrIcon'

import { View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  ImageBackground, 
  StyleSheet, 
  Image,
  TextInput,
  Keyboard, 
  Linking
} from 'react-native'

import { showMessage } from 'react-native-flash-message'

import Terms from '../terms/terms'

export default function Register( { navigation } ) {

  const [ disableButton, setDisableButton ] = useState(false)
  const [ showTerms, setShowTerms ] = useState(false)
  const [ showQr, setShowQr ] = useState(true);
  const [ formType, setFormType ] = useState('')
  const [ registerInfo, setRegisterInfo ] = useState({
    residence: '.',
    name: '',
    cel: '',
    id: ''
  })

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  },[showTerms])

  const _keyboardDidShow = () => {
    setShowQr(false)
  };

  const _keyboardDidHide = () => {
    setShowQr(true)
  };

  const onRegisterPress = () => {

    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

    const { name, cel, residence, id, email } = registerInfo;

    if(formType !== ''){
		  if(residence !== '.'){
				if(cel.length === 10 && cel > 3000000000 && cel < 6000000000){
					if(id.length === 8 || id.length === 10){
            if(name.length > 10){
              if (emailRegex.test(email)){
                setShowTerms(true)
              }else{
                showMessage({
                  icon: 'danger',
                  type: 'danger',
                  message: 'Ingrese un correo valido',
                  floating: true,
                  titleStyle: {
                    fontSize: 17
                  }
                })
              }
            }else{
              showMessage({
                icon: 'danger',
                type: 'danger',
                message: 'Ingrese su nombre completo',
                duration: 3000,
                floating: true,
                titleStyle: {
                  fontSize: 17
                }
              })
            }
					}else{
            showMessage({
              icon: 'danger',
              type: 'danger',
              message: 'Ingrese un documento válido',
              duration: 3000,
              floating: true,
              titleStyle:{
                fontSize: 17
              }
            })
					}
				}else{
          showMessage({
            icon: 'danger',
            type: 'danger',
            message: 'Por favor ingrese un celular valido',
            duration: 3000,
            floating: true,
            titleStyle:{
              fontSize: 17
            }
          })
				}
			}else{
        showMessage({
          icon: 'danger',
          type: 'danger',
          message: 'Por favor seleccione un establecimiento',
          duration: 3000,
          floating: true,
          titleStyle:{
            fontSize: 17
          }
        })
			}
		}else{
			showMessage({
        icon: 'danger',
        type: 'danger',
        message: 'Por favor seleccione el tipo de establecimiento',
        duration: 3000,
        floating: true,
        titleStyle:{
          fontSize: 17
        }
      })
		}
  }

  return (
    <View style={{flex: 1, flexDirection: 'column'}}>

      <Terms 
        showTerms={showTerms}
        setShowTerms={setShowTerms}
        setDisableButton={setDisableButton}
        registerInfo={registerInfo}
        setRegisterInfo={setRegisterInfo}
        navigation={navigation}
      />

      <ImageBackground
        style={styles.imgBackground}
        source={require('../../img/background-signin.png')}
      >

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
        

          <View style={styles.container}>

            <Image 
              source={require('../../img/icon.png')}
              style={{
                width: wp('90%'),
                height: hp('40%'),
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
              }}
            />

            <View style={styles.formSection}>
              
              <View style={styles.pickerSection}>

              <Picker
                style={styles.picker}
                selectedValue={formType}
                onValueChange={(value) => {
                  setFormType(value)
                }}
              >
                <Picker.Item 
                  label="Tipo establecimiento"
                  value="."
                />
                <Picker.Item 
                  label="Gimnasio"
                  value="gym"
                />
                <Picker.Item 
                  label="Iglesia"
                  value="church"
                />
                <Picker.Item 
                  label="Restaurante"
                  value="rest"
                />
                
              </Picker>
              <FontAwesomeIcon 
                icon={faQuestion}
                size={30}
                style={styles.pickerIcon}
              />
              </View>
              <SelectResidence 
                estype={formType}
                styles={styles}
                residence={registerInfo.residence}
                setResidence={setRegisterInfo}
              />

              <View style={styles.inputSection}>
                <TextInput 
                  keyboardType='email-address'
                  placeholder="Correo Electrónico"
                  placeholderTextColor="#000000a1"
                  style={styles.inputSectionInput}
                  onChangeText={text => setRegisterInfo(oldInfo => ({
                    ...oldInfo,
                    email: text
                  }))}
                />
                <FontAwesomeIcon 
                  icon={faEnvelope}
                  size={25}
                  style={styles.inputSectionIcon}
                />
              </View>

              <View style={styles.inputSection}>
                <TextInput 
                  placeholder="Nombres y Apellidos"
                  placeholderTextColor="#000000a1"
                  style={styles.inputSectionInput}
                  onChangeText={text => setRegisterInfo(oldInfo => ({
                    ...oldInfo,
                    name: text
                  }))}
                />
                <FontAwesomeIcon 
                  icon={faUser}
                  size={25}
                  style={styles.inputSectionIcon}
                />
              </View>

              <View style={styles.inputSection}>
                <TextInput 
                  keyboardType='numeric'
                  placeholder="Numero de Celular"
                  placeholderTextColor="#000000a1"
                  style={styles.inputSectionInput}
                  maxLength={10}
                  onChangeText={text => setRegisterInfo(oldInfo => ({
                    ...oldInfo,
                    cel: text
                  }))}
                />
                <FontAwesomeIcon 
                  icon={faMobileAlt}
                  size={25}
                  style={styles.inputSectionIcon}
                />
              </View>

              <View style={styles.inputSection}>
                <TextInput 
                  keyboardType='numeric'
                  placeholder="Documento de identidad"
                  placeholderTextColor="#000000a1"
                  style={styles.inputSectionInput}
                  maxLength={10}
                  onChangeText={text => setRegisterInfo(oldInfo => ({
                    ...oldInfo,
                    id: text
                  }))}
                />
                <FontAwesomeIcon 
                  icon={faIdCard}
                  size={25}
                  style={styles.inputSectionIcon}
                />
              </View>

              {
                disableButton
                ?<TouchableOpacity
                  style={[styles.registerButton, {opacity: .7}]}
                  disabled
                  onPress={() => onRegisterPress()}
                >
                  <Text style={styles.registerButtonText}>Espere...</Text>
                </TouchableOpacity>

                :<TouchableOpacity
                  style={styles.registerButton}
                  activeOpacity={.8}
                  onPress={() => onRegisterPress()}
                >
                  <Text style={styles.registerButtonText}>Registrarse</Text>
                </TouchableOpacity>
              }

              <TouchableOpacity
                style={styles.signIn}
                activeOpacity={.8}
                onPress={() => {
                  navigation.goBack()
                }}
              >
                <Text 
                style={styles.signInText}
                >
                  Inicia Sesión Aquí
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contact}
                activeOpacity={.8}
                onPress={() => Linking.openURL('whatsapp://send?text=Hola!&phone=573044285676')}
              >
                <Text
                style={{
                  fontFamily: 'Raleway-Light',
                  fontSize: hp('2.5%')
                }}>
                  Contactanos
                </Text>
              </TouchableOpacity>
            </View>

          </View>
          
        </ScrollView>
        {
          showQr === true
          ?<QrIcon 
            navigation={navigation}
            color={'#eb9931'}
          />
          :null
        }
        

      </ImageBackground>
      
    </View>
  )
}

const styles = StyleSheet.create({
  imgBackground:{
    flex: 1,
  },
  container: {
    width: wp('90%'),
    marginVertical: 50,
    backgroundColor: '#FFF',
    borderRadius: 20,
    shadowColor: "#000000a1",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    alignItems: 'center',
  },
  formSection:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputSection:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eb9931',
    marginBottom: 10,
    width: wp('60%'),
  },
  inputSectionIcon:{
    color: '#eb9931',
  },
  inputSectionInput:{
    width: '80%',
    fontSize: hp('2%'),
    fontFamily: 'Raleway-Medium'
  },
  registerButton:{
    marginTop: 20,
    backgroundColor: '#eb9931',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 100,
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: hp('3.5%'),
    fontFamily: 'Raleway-SemiBold'
  },
  signIn:{
    marginVertical: 20,
  },
  signInText:{
    fontFamily: 'Raleway-Light',
    fontSize: hp('2.5%')
  },
  contact:{
    marginBottom: 20
  },
  pickerResidence: {
    color: '#000000a1',
    marginRight: 17,
    marginLeft: -17,
    transform: [
      { scaleX: 0.9 }, 
      { scaleY: 0.9 },
    ],
  },
  pickerSection:{
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eb9931',
    marginBottom: 10,
    width: wp('60%'),
  },
  picker: {
    width: '100%',
    color: '#000000a1',
    marginRight: 17,
    marginLeft: -10,
    transform: [
      { scaleX: 0.9 }, 
      { scaleY: 0.9 },
    ],
  },
  pickerIcon:{
    color: '#eb9931',
    position: 'absolute',
    alignSelf: 'flex-end',
  },
})