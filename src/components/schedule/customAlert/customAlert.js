import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';

import { showMessage } from 'react-native-flash-message';

import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native'

export default function CustomAlert( { setMainLoading, setShowCustomAlert, actualUser, element, modalParams, dateSelected, getData } ) {

  const { message, action } = modalParams

  const [ loading, setLoading ] = useState(false)

  const selectTurn = () => {
    setLoading(true)
    fetch('https://api-gestion.mascentigrados.com/selectturn', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        docid: actualUser.id,
        selectedTurn: element,
        date: dateSelected
      })
    })
    .then(response => response.json())
    .then(data => {
      if(data === 'success'){
        showMessage({
          icon: 'success',
          type: 'success',
          message: 'Agendado con exito',
          floating: true,
          duration: 3000,
          titleStyle: {
            fontSize: 20,
            paddingVertical: 5,
          }
        })
        setMainLoading(true)
        setLoading(false)
        setShowCustomAlert(false)
        getData()
      }else{
        showMessage({
          icon: 'danger',
          type: 'danger',
          message: 'Error al agendar, por favor intentalo de nuevo mas tarde',
          floating: true,
          duration: 3000,
          titleStyle: {
            fontSize: 20,
            paddingVertical: 5,
          }
        })
        setMainLoading(true)
        setLoading(false)
        setShowCustomAlert(false)
        getData()
      }
    })
    .catch(err => console.log(err))
  }

  const deleteTurn = () => {
    setLoading(true)
    fetch('https://api-gestion.mascentigrados.com/deleteturn', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        docid: actualUser.id,
        deletedTurn: element,
        date: dateSelected
      })
    })
    .then(response => response.json())
    .then(data => {
      if(data === 'delete-success'){
        showMessage({
          icon: 'success',
          type: 'success',
          message: 'Eliminado con exito',
          floating: true,
          duration: 3000,
          titleStyle: {
            fontSize: 20,
            paddingVertical: 5,
          }
        })
        setMainLoading(true)
        setLoading(false)
        setShowCustomAlert(false)
        getData()
      }else{
        showMessage({
          icon: 'danger',
          type: 'danger',
          message: 'Error al Eliminar, por favor intentalo de nuevo mas tarde',
          floating: true,
          duration: 3000,
          titleStyle: {
            fontSize: 20,
            paddingVertical: 5,
          }
        })
        setMainLoading(true)
        setLoading(false)
        setShowCustomAlert(false)
        getData()
      }
    })
    .catch(err => console.log(err))
  }


  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.alertModal}>
        {
          loading
          ?<ActivityIndicator 
            size={150}
            color="#FFF"
          />
          :<View style={styles.alertContainer}>
          <View style={styles.iconContainer}>
            <FontAwesomeIcon 
              icon={faQuestion}
              size={50}
              style={{color: '#FFF'}}
            />
          </View>
          <Text style={{
            fontSize: 20, 
            marginHorizontal: 20, 
            textAlign: 'center',
            marginBottom: 20,
          }}>
            {message}
          </Text>

          <View
            style={{
              flexDirection: 'row', 
              width: '100%', 
              justifyContent:'space-around', 
              paddingVertical: 20 
              }}
          >
            
            <TouchableOpacity
              activeOpacity={.8}
              style={[styles.alertButton, { backgroundColor: 'green' }]}
              onPress={() => {
                action === 'selectTurn'
                ?selectTurn()
                :deleteTurn()
              }}
            >
              <Text style={styles.alertButtonText}>Si!</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={.8}
              style={[styles.alertButton, { backgroundColor: 'red' }]}
              onPress={() => {
                setShowCustomAlert(false)
              }}
            >
              <Text style={styles.alertButtonText}>No!</Text>
            </TouchableOpacity>

          </View>

        </View>
        }
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  alertModal:{
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#00000073',
    alignItems: 'center',
    justifyContent: 'center'
  },
  alertContainer:{
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
    marginBottom: 20,
  },
  alertButton:{
    backgroundColor: 'gray',
    paddingVertical: 10,
    width: 100,
    borderRadius: 100
  },
  alertButtonText:{
    color: '#FFF',
    fontSize: 20,
    textAlign: 'center'    
  }
})
