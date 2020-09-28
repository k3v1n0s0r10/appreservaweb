import React from 'react'

import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native'

import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

export default function SubAdminModal( { routeSubAdmin, visible, setShowSubAdminModal } ) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.subAdminModal}>

        <View style={styles.subAdminModalContainer}>

          <View style={styles.iconContainer}>

            <FontAwesomeIcon 
              icon={faQuestion}
              size={50}
              style={{color: '#fff'}}
            />

          </View>

            <Text
              style={{
                fontSize: 30,
                fontFamily: 'Raleway-Medium'
              }}
            >
              Hola!
            </Text>

            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Raleway-Medium'
              }}
            >
              Ingresar como: 
            </Text>

            <TouchableOpacity
              activeOpacity={.8}
              style={[styles.button, {backgroundColor: 'green'}]}
              onPress={() => {
                routeSubAdmin('subadmin')
                setShowSubAdminModal(false)
              }}
            >
              <Text style={styles.buttonText}>SubAdministrador</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={.8}
              style={[styles.button, {backgroundColor: 'blue'}]}
              onPress={() => {
                routeSubAdmin('user')
                setShowSubAdminModal(false)
              }}
            >
              <Text style={styles.buttonText}>Usuario</Text>
            </TouchableOpacity>

        </View>

      </View>

    </Modal>
  )
}

const styles = StyleSheet.create({
  subAdminModal:{
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#00000073',
    alignItems: 'center',
    justifyContent: 'center'
  },
  subAdminModalContainer:{
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: 300,
    alignItems: 'center'
  },
  iconContainer:{
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#FFF',
    marginTop: -40,
    marginBottom: 10,
  },
  button:{
    width: 280,
    marginBottom: 20,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20
  },
  buttonText:{
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Raleway-Medium'
  }
})