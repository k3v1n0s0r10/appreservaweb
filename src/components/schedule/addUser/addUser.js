import React, { useState } from 'react'

import { useRoute } from "@react-navigation/native";
import { showMessage } from 'react-native-flash-message';

import { 
  Modal, 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  BackHandler, 
  Platform
} from 'react-native'

export default function AddUser( { setShowAddUser, actualUser, mainColor, navigation } ) {

  const actualRoute = useRoute()

  const [ loading, setLoading ] = useState(false)
  const [ registerInfo, setRegisterInfo ] = useState({
    id: '',
    name: '',
    email: '',
    cel: '',
  })

  const validationsSuccess = () => {
    setLoading(true)
    fetch('https://api-gestion.mascentigrados.com/duroregister', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        id: registerInfo.id,
        name: registerInfo.name,
        cel: registerInfo.cel,
        email: registerInfo.email,
        residence: actualUser.residence,
        apt: actualUser.apt,
        rol: 'acomp',
      })
    })
    .then(response => response.json())
    .then( data=> {
      if(data === 'already'){
        showMessage({
          type: 'warning',
          icon: 'warning',
          message: 'Este usuario ya esta registrado',
          floating: true,
          duration: 3000,
          titleStyle:{
            fontSize: 17
          }
        })
        setLoading(false)
        setShowAddUser(false)
      }else if(data === 'register-success'){
        showMessage({
          type: 'success',
          icon: 'success',
          message: 'Registrado Correctamente',
          floating: true,
          duration: 3000,
          titleStyle:{
            fontSize: 17
          }
        })
        setLoading(false)
        setShowAddUser(false)
      }else{
        showMessage({
          type: 'danger',
          icon: 'danger',
          message: 'Ha ocurrido un error inesperado, por favor inténtelo mas tarde',
          floating: true,
          duration: 3000,
          titleStyle:{
            fontSize: 17
          }
        })
        setLoading(false)
        setShowAddUser(false)
      }
    })
    .catch(err => console.log(err))
  }

  const onSubmit = () => {
    
    if(parseInt(registerInfo.id) !== actualUser.id){
      if(registerInfo.id.length === 8 || registerInfo.id.length === 10){
        if(registerInfo.name.length > 8){
          if(registerInfo.cel.length === 10 && registerInfo.cel > 2900000000 && registerInfo.cel < 6000000000){
            if(registerInfo.email.length > 10){
              validationsSuccess()
            }else{
              showMessage({
                type: 'warning',
                icon: 'warning',
                message: 'Ingresa un correo valido',
                floating: true,
                duration: 3000,
                titleStyle:{
                  fontSize: 17
                }
              })
            }
          }else{
            showMessage({
              type: 'warning',
              icon: 'warning',
              message: 'Ingresa un numero de telefono valido',
              floating: true,
              duration: 3000,
              titleStyle:{
                fontSize: 17
              }
            })
          }
        }else{
          showMessage({
            type: 'warning',
            icon: 'warning',
            message: 'Por favor ingresa el nombre completo',
            floating: true,
            duration: 3000,
            titleStyle:{
              fontSize: 17
            }
          })
        }
      }else{
        showMessage({
          type: 'warning',
          icon: 'warning',
          message: 'Ingrese un documento valido',
          floating: true,
          duration: 3000,
          titleStyle:{
            fontSize: 17
          }
        })
      }
    }else{
      showMessage({
        type: 'warning',
        icon: 'warning',
        message: 'No te puedes registrar a ti mismo',
        floating: true,
        duration: 3000,
        titleStyle:{
          fontSize: 17
        }
      })
    }
  }

  const onInputChange = ({value, name}) => {

		setRegisterInfo( oldInfo => ({
      ...oldInfo,
      [name]: value
    }))
  }

  return(
    <Modal 
      visible={true} 
      transparent={true} 
      animationType="fade"
    >
      <ScrollView contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: '#00000093',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
       {
         loading
         ?<ActivityIndicator 
            color='#FFF'
            size={
              Platform.OS === 'ios' ?'large' :70
            }
         />
         :<View style={styles.addUserContainer}>
            <Text style={[styles.addUserTitle, {backgroundColor: mainColor}]}>Añade integrantes de tu hogar</Text>
            <TextInput 
              placeholder="Nombres Y Apellidos"
              style={styles.addUserInput}
              onChangeText={(text) => onInputChange({value: text, name: 'name'})}
            />
            <TextInput 
              placeholder="Numero Documento"
              style={styles.addUserInput}
              onChangeText={(text) => onInputChange({value: text, name: 'id'})}
              keyboardType="numeric"
              maxLength={10}
            />
            <TextInput
              placeholder="Correo Electronico"
              style={styles.addUserInput}
              onChangeText={(text) => onInputChange({value: text, name: 'email'})}
              keyboardType="email-address"
            />
            <TextInput 
              placeholder="Numero Celular"
              style={styles.addUserInput}
              onChangeText={(text) => onInputChange({value: text, name: 'cel'})}
              keyboardType="numeric"
              maxLength={10}
            />
            <View style={styles.addUserButtons}>

              <TouchableOpacity
                onPress={() => setShowAddUser(false)}
                style={[styles.addUserButton, {backgroundColor: mainColor}]}
                activeOpacity={.7}
              >
                <Text style={{color: '#FFF', fontSize: 20}}>Atras</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addUserButton}
                activeOpacity={.7}
                onPress={() => onSubmit()}
              >
                <Text style={{color: '#FFF', fontSize: 20}}>Registrar</Text>
              </TouchableOpacity>

          </View>
        </View>
       }
      </ScrollView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  addUserModal:{
    
  },
  addUserContainer:{
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
  },
  addUserTitle:{
    textAlign: 'center',
    fontSize: 21,
    paddingVertical: 20,
    marginBottom: 10,
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    color: '#FFF',
    fontFamily: 'Raleway-Medium'
  },
  addUserInput: {
    borderWidth: 1,
    borderColor: '#000',
    width: '90%',
    marginVertical: 10,
  },
  addUserButtons:{
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  addUserButton:{
    backgroundColor: 'blue',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 100
  }
})