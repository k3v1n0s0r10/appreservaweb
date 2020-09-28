import React, { useEffect, useState } from 'react'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faIdCard } from '@fortawesome/free-solid-svg-icons'

import { showMessage } from 'react-native-flash-message'

import { useRoute } from "@react-navigation/native";

import { View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  ImageBackground, 
  StyleSheet, 
  Image,
  TextInput,
  Keyboard, 
  BackHandler, 
  Alert, 
  Platform,
  Linking
} from 'react-native'

import SelectResidence from '../selectResidence/selectResidence'
import QrIcon from '../qrIcon/qrIcon'
import CovidQuestions from '../covidQuestions/covidQuestions'
import CovidAlert from '../covidAlert/covidAlert'
import SubAdminModal from '../subAdminModal/subAdminModal';

export default function SignIn( { navigation, route } ) {

  const { actualUser } = route.params

  const actualRoute = useRoute()

  const [ subAdminData, setSubAdminData ] = useState('')
  const [ showSubAdminModal, setShowSubAdminModal ] = useState(false)
  const [ disableButton, setDisableButton ]= useState(false)
  const [ showCovidAlert, setShowCovidAlert ] = useState(false)
  const [ showModal, setShowModal ] = useState(false)
  const [ showQr, setShowQr ] = useState(true);
  const [ signInInfo, setSignInInfo ] = useState({
    residence: '.',
    id: ''
  })

  useEffect(() => {
    
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
    if(actualRoute.name === 'SignIn' && Platform.OS === "android"){
      BackHandler.addEventListener("hardwareBackPress", _backAction);
    }

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
      BackHandler.removeEventListener("hardwareBackPress", _backAction);
    };
  },[])

  const _keyboardDidShow = () => {
    setShowQr(false)
  };

  const _keyboardDidHide = () => {
    setShowQr(true)
  };

  const _backAction = () => {
    Alert.alert("Espera!", "¿Estas seguro que quieres salir de la aplicación?", [
      {
        text: "No!",
        onPress: () => null,
        style: "cancel"
      },
      { text: "Si!", onPress: () => BackHandler.exitApp() }
    ]);
    return true;
  }

  const routeSubAdmin = (redirect) => {

    if(redirect === 'subadmin'){
      navigation.navigate('SubAdmin', { actualUser: subAdminData[0], places: subAdminData[1] })
    }else{
      if(subAdminData[1][1]){
        navigation.navigate('Switch', { actualUser: subAdminData, places: subAdminData[1]})
      }else{
        navigation.navigate('Schedule', { place: subAdminData[1][0].place, actualUser: subAdminData } )
      }
    }
  }

  const validateData = () => {
    if(signInInfo.residence !== '.'){
      if(signInInfo.id.length === 8 || signInInfo.id.length === 10){
        onValidateSuccess()
      }else{
        showMessage({
          message: 'Por favor ingrese un documento valido',
          type: 'danger',
          icon: 'warning',
          floating: true,
          duration: 3000,
          titleStyle: {
            fontSize: 18,
          }
        })
      }
    }else{
      showMessage({
        message: 'Por favor seleccione un establecimiento',
        type: 'danger',
        icon: 'warning',
        floating: true,
        duration: 3000,
        titleStyle: {
          fontSize: 17,
        }
      })
    }
  }

  const onValidateSuccess = () => {
    setDisableButton(true)
    fetch('https://api-gestion.mascentigrados.com/signin', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        docid: signInInfo.id,
        residence: signInInfo.residence
      })
    })
    .then(response => response.json())
    .then(data => {

      setDisableButton(false)

      if(data === 'invalid-credentials-residence'){

        showMessage({
          icon: 'warning',
          type: 'danger',
          message:'El usuario no está registrado. Comuníquese con su administración para que lo registren',
          duration: 3000,
          floating: true,
          titleStyle: {
            fontSize: 17,
          }
        })

      }else if(data === 'invalid-credentials'){

        showMessage({
          icon:'warning',
          type: 'danger',
          message: 'El usuario no esta registrado',
          floating: true,
          duration: 3000,
          titleStyle: {
            fontSize: 17,
          }
        })

      }else if(data === 'invalid-residence'){

        showMessage({
          icon: 'warning',
          type: 'danger',
          message: 'El usuario esta registrado en otra residencia',
          floating: true,
          duration: 3000,
          titleStyle: {
            fontSize: 17,
          }
        })

			}else if(data === 'failed-select-other-residence' || data === 'failed-user'){

        showMessage({
          icon: 'danger',
          type: 'danger',
          message: 'Ha ocurrido algo inesperado, por favor inténtelo de nuevo mas tarde',
          floating: true,
          duration: 3000,
          titleStyle: {
            fontSize: 17,
          }
        })

      }else if(data === 'already-register'){

        showMessage({
          icon: 'info',
          type: 'info',
          message: 'Tu registro ya fue enviado.',
          description:'Podras iniciar sesion en cuanto aprueben tu registro, ingresa con regularidad a ver si ya te aprobaron, si este proceso tarda mucho comunicate con el establecimiento correspondiente para que aprueben tu registro',
          floating: true,
          duration: 3000,
          titleStyle:{
            fontSize: 17
          }
        })
        
      }else if(data[2] === 'subadmin'){

        data.splice(2, 1)
        setSubAdminData(data)
        setShowSubAdminModal(true)

      }else if(data[0]){
        navigation.setParams({actualUser: data})
        setShowModal(true)
      }else{
        
        showMessage({
          icon: 'danger',
          type: 'danger',
          message: 'Ha ocurrido algo inesperado, por favor inténtelo de nuevo mas tarde',
          floating: true,
          duration: 3000,
          titleStyle: {
            fontSize: 17,
          }
        })

      }

    })
  }
  
  return (
    <View style={{flex: 1, flexDirection: 'column'}}>

      <CovidAlert 
        visible={showCovidAlert}
        setShowCovidAlert={setShowCovidAlert}        
      />

      <SubAdminModal 
        visible={showSubAdminModal}
        setShowSubAdminModal={setShowSubAdminModal}
        routeSubAdmin={routeSubAdmin}
      />
      
      <CovidQuestions
        visible={showModal}
        setShowModal={setShowModal}
        setShowCovidAlert={setShowCovidAlert}
        navigation={navigation}
        actualUser={actualUser}
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
              <SelectResidence 
                estype='none'
                styles={styles}
                residence={signInInfo.residence}
                setResidence={setSignInInfo}
              />

              <View style={styles.inputSection}>
                <TextInput 
                  keyboardType='numeric'
                  placeholder="Documento de identidad"
                  placeholderTextColor="#000000a1"
                  style={styles.inputSectionInput}
                  maxLength={10}
                  onChangeText={text => setSignInInfo(oldInfo => ({
                    ...oldInfo,
                    id: text
                  }))}
                />
                <FontAwesomeIcon 
                  icon={faIdCard}
                  size={hp('5%')}
                  style={styles.inputSectionIcon}
                />
              </View>

              {
                disableButton
                ?<TouchableOpacity
                style={styles.signInButton}
                activeOpacity={.8}
                disabled
              >
                <Text style={styles.signInButtonText}>Espere...</Text>
              </TouchableOpacity>

                :<TouchableOpacity
                  style={styles.signInButton}
                  activeOpacity={.8}
                  onPress={() => validateData()}
                >
                  <Text style={styles.signInButtonText}>Inicia Sesión</Text>
                </TouchableOpacity>
              }

              <TouchableOpacity
                style={styles.registerButton}
                activeOpacity={.8}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={
                  styles.registerButtonText
                }>
                  Registrate aquí
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
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: wp('90%'),

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.9,
    shadowRadius: 10.32,
    elevation: 10,

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
    marginBottom: 30,
    width: wp('60%')
  },
  inputSectionIcon:{
    color: '#eb9931',
  },
  inputSectionInput:{
    width: '80%',
    fontSize: hp('2%'),
    fontFamily: 'Raleway-Medium'
  },
  signInButton:{
    backgroundColor: '#eb9931',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 100,
  },
  signInButtonText: {
    color: '#FFF',
    fontSize: hp('3.5%'),
    fontFamily: 'Raleway-SemiBold'
  },
  registerButton:{
    marginVertical: 20,
  },
  registerButtonText:{
    fontFamily: 'Raleway-Light',
    fontSize: hp('2.5%'),
  },
  contact:{
    marginBottom: 20
  },
  pickerSection:{
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eb9931',
    marginBottom: 30,
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