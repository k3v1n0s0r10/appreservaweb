import React, { useState, useEffect } from 'react'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCaretLeft, faSignOutAlt, faCheck, faLock, faTimes, faUserPlus } from '@fortawesome/free-solid-svg-icons'

import { Picker } from '@react-native-community/picker'

import CustomAlert from './customAlert/customAlert'
import AddUser from './addUser/addUser'

import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet,
  ActivityIndicator, 
  Alert, 
  Platform, 
  TouchableOpacity
} from 'react-native'



export default function Schedule( { route, navigation } ) {

  const { place, actualUser, back } = route.params

  const actualUserInfo = actualUser[0][0]


  /* Obteniendo Fecha y Hora */
  let MyDate = new Date();
  MyDate.setDate(MyDate.getDate());
  const MyDateString =  MyDate.getFullYear()+ '-'
                      + ('0' + (MyDate.getMonth()+1)).slice(-2) + '-'
                      + ('0' + MyDate.getDate()).slice(-2);
  let day_miliseconds = 24 * 60 * 60 * 1000;
  let tomorrowDate = new Date(MyDate.getTime() + day_miliseconds);
  const tomorrowDateString = tomorrowDate.getFullYear()+ '-'
                      + ('0' + (tomorrowDate.getMonth()+1)).slice(-2) + '-'
                      + ('0' + tomorrowDate.getDate()).slice(-2);
  let actualTime = ('0' + MyDate.getHours()).slice(-2)+ ':' + ('0' + MyDate.getMinutes()).slice(-2);
  /* Final Fecha y Hora*/


  /* States */
  const [ dateSelected, setDateSelected ] = useState(MyDateString)
  const [ actualDay, setActualDay ] = useState(MyDate.getDay())
  const [ dataGet, setDataGet ] = useState('')
  const [ loading, setLoading ] = useState(true)
  const [ customAlert, setCustomAlert ] = useState('')
  const [ showCustomAlert, setShowCustomAlert ] = useState(false)
  const [ showAddUser, setShowAddUser ] = useState(false)
  
  
  useEffect(() => {

    getData();

    const intervalId = setInterval(() => {

      getData();

    }, 5000);
    return () => clearInterval(intervalId);  
    // eslint-disable-next-line

  },[dateSelected])


  const getData = () => {
    fetch ('https://api-gestion.mascentigrados.com/datereturn',{
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        place: place,
        day: actualDay,
        residence: actualUserInfo.residence,
        docid: actualUserInfo.id,
        date: dateSelected
      })
    })
    .then(response => response.json())
    .then(data => {
      if(data[1] === 'ATurnIsSelected'){
        showTurnSelected(data[0])
      }
      else if(!data[0][0]){
        showNonHor(data)
      }
      else{
        ShowData(data)
      }
    })
    .catch(err => console.log(err))

    MyDate = new Date();
    actualTime = ('0' + MyDate.getHours()).slice(-2)+ ':' + ('0' + MyDate.getMinutes()).slice(-2);
    return (MyDate, actualTime)
  }

  const onDateChange = (e) => {
    if(e === MyDateString){
      setLoading(true)
      setDateSelected(e)
      setActualDay(MyDate.getDay())
    }
    else if(e === tomorrowDateString){
      setLoading(true)
      setDateSelected(e)
      setActualDay(tomorrowDate.getDay())
    }
  }

  const ShowData = (data) => {
    
    let hGet =
    data[0].sort(function (a, b) {
      if (a.h > b.h) {
        return 1;
      }
      if (a.h < b.h) {
        return -1;
      }
      // a must be equal to b
      return 0;
    })

    setDataGet(
      hGet.map( (element) => {
        let cupsJis = element.cups;

        data[1].forEach( function(selecciones) {
          if(element.id === selecciones.idh){
            cupsJis -= 1
          }
        })

        let selectH, full;

        if(cupsJis <= 0 || cupsJis <= '0' || ((element.h.slice(-5)) < (actualTime.toString()) && element.day === (MyDate.getDay()))){
          
          full = true
          selectH = 
          <FontAwesomeIcon 
            icon={faLock}
            style={{alignSelf: 'center'}}
          />
         
        }else{
          selectH = 
          <FontAwesomeIcon 
            icon={faCheck}
            size={30}
            onPress={() => {
              showAlert({
                element: element,
                action: 'selectTurn',
                message: `Estas seguro que deseas seleccionar ${element.h}`
              })
            }}
            style={{alignSelf: 'center', color: 'green'}}
          /> 
        }

        return(
          <View key={element.id} style={[styles.turn, full && styles.full]}>
            <Text style={styles.centerText}>{element.h}</Text>
            <Text style={styles.centerText}>{cupsJis}</Text>
            <View style={{flex: 1}}>
              {selectH}
            </View>
          </View>
        )
      })
    )
    setLoading(false)
  }

  const showTurnSelected = (data) => {

    let selectH;

    const dataDate = new Date(data[0].date)

    if(data[0].h.slice(-5) < (actualTime.toString()) && dataDate < MyDate){
      full = 'full'
      selectH = 
      <FontAwesomeIcon 
        icon={faLock}
        size={20}
        style={{alignSelf: 'center'}}
      /> 
    }else{
      selectH = 
      <FontAwesomeIcon 
        icon={faTimes}
        size={30}
        style={{alignSelf: 'center', color: 'red'}}
        onPress={() => {
          showAlert({
            element: data,
            action: 'deleteTurn',
            message: `Estas seguro que deseas Eliminar ${data[0].h}`
          })
        }}  
      /> 
    }

    setDataGet(
      <View key={data[0].id}>

        <Text style={{textAlign: 'center', fontSize: 25, fontFamily: 'Raleway-BoldItalic', marginVertical: 20, color: mainColor}}>AGENDADO</Text>

        <View style={[styles.turn, { borderTopWidth: 1, backgroundColor: '#1ead0091'}]}>

          <Text style={[styles.centerText, {color: '#000', fontSize: 20}]}>{data[0].h}</Text>
          <View style={{flex: 1}}>
            {selectH}
          </View>

        </View>

      </View>
    )
    setLoading(false)
  }

  const showNonHor = () => {
    setDataGet(
      <Text style={styles.nonHorText}>No hay ningún horario este día</Text>
    )
    setLoading(false)
  }

  const showAlert = ( { element, message, action } ) => {

    const modalParams = {
      action: action,
      message: message
    }

    setShowCustomAlert(true)

    setCustomAlert(
      <CustomAlert 
        setShowCustomAlert={setShowCustomAlert}
        element={element}
        actualUser={actualUserInfo}
        modalParams={modalParams}
        dateSelected={dateSelected}
        getData={getData}
        setMainLoading={setLoading}
      />
    )
  }

  let placeText, mainColor;

  if(place === 'gym'){
    mainColor = '#1f1f1f'
    placeText = 'Gimnasio'
  }else if(place === 'pool'){
    mainColor = '#2daae1'
    placeText = 'Piscina'
  }else if(place === 'church'){
    mainColor = '#ab6300'
    placeText = 'Iglesia'
  }else if(place === 'rest'){
    mainColor = '#b70011'
    placeText = 'Restaurante'
  }else if(place === 'turk'){
    mainColor = '#60595c'
    placeText = 'Turco'
  }else if(place === 'sauna'){
    mainColor = '#8c6c39'
    placeText = 'Sauna'
  }else if(place === 'pingpong'){
    mainColor = '#30a749'
    placeText = 'Ping-Pong'
  }else if(place === 'oldsroom'){
    mainColor = '#b4784f'
    placeText = 'Zona adulto mayor'
  }else if(place === 'childsroom'){
    mainColor = '#f13d2c'
    placeText = 'Zona infantil'
  }else if(place === 'court'){
    mainColor = '#1b7106'
    placeText = 'Cancha'
  }

  return (

      <View style={{flex:1, backgroundColor: mainColor }}>

        {
          showCustomAlert
          ?customAlert
          :null
        }

        {
          showAddUser
          ?<AddUser 
            setShowAddUser={setShowAddUser}
            actualUser={actualUserInfo}
            mainColor={mainColor}
            navigation={navigation}
          />
          :null
        }
        
        <View style={styles.header}>

          <View style={{flex: 1, justifyContent: 'center'}}>

            {
              back
              ?<FontAwesomeIcon 
                icon={faCaretLeft}
                size={40}
                style={styles.headerButton}
                onPress={() => {
                  navigation.goBack()
                }}
              />
              :null
            }
            

          </View>
          <Text style={styles.headerText}>{placeText}</Text>

          <View style={{flex: 1, justifyContent: 'center'}}>

            <FontAwesomeIcon 
              icon={faSignOutAlt}
              size={30}
              style={styles.headerButton}
              onPress={() => {
                navigation.navigate('SignIn')
              }}
            />

          </View>
        </View>

        <View style={styles.container}>

          <Text style={[styles.containerResidence, {color: mainColor}]}>{actualUser[0][0].residence.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))}</Text>

          <Text style={{fontSize: hp('3%'), fontFamily:'Raleway-Medium'}}>Dia:</Text>
            
          <View style={{borderWidth:1, borderColor: 'gray', paddingLeft: 30,paddingHorizontal:10, borderRadius: 100,}}>
            <Picker 
              style={styles.dayPicker}
              selectedValue={dateSelected}
              itemStyle={{textAlignVertical: 'center', alignSelf: 'center', justifyContent: 'center'}}
              onValueChange={(value) => onDateChange(value)}
            >

              <Picker.Item
                label="Hoy"
                value={MyDateString}
              />
              <Picker.Item 
                label="Mañana"
                value={tomorrowDateString}
              />
              
            </Picker>
          </View>

          <Text style={{marginTop: 20, fontSize: hp('3%'), fontFamily:'Raleway-Medium'}}>Horarios disponibles:</Text>
          <View style={styles.hor}>
            <View style={[styles.horGuide, {backgroundColor: mainColor}]}>
              <Text style={[styles.centerText, styles.horGuideText]}>Horario</Text>
              <Text style={[styles.centerText, styles.horGuideText]}>Cupos</Text>
              <Text style={[styles.centerText, styles.horGuideText]}>Selecciona</Text>
            </View>
            <View style={styles.horSection}>
              <ScrollView 
                contentContainerStyle={{
                  flexGrow: 1,
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                {
                  loading
                  ?<View style={styles.loading}>
                    <ActivityIndicator
                      color={mainColor}
                      size={
                        Platform.OS === 'ios' ?'large' :70
                      }
                    />
                  </View>
                  :dataGet
                }
              </ScrollView>
            </View>
          </View>
          {
            actualUserInfo.rol === 'duro'
            &&<TouchableOpacity style={{flexDirection: 'row', alignItems:'center', marginTop: 10}}
              activeOpacity={.7}
              onPress={() => {
                setShowAddUser(true)
              }}
            >
              <FontAwesomeIcon 
                icon={faUserPlus}
                size={30}
                color={mainColor}
              />
              <Text style={{fontSize: 15, marginLeft: 10}}>Añade un usuario</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
  header:{
    flexDirection: 'row',
    marginVertical: 30,
  },
  headerButton:{
    color: '#FFF',
    alignSelf: 'center',
  },
  headerText:{
    flex: 1,
    color: '#FFF',
    fontSize: hp('3%'),
    fontFamily: 'Raleway-Medium',
    textAlign: 'center'
  },
  container: {
    alignSelf: 'center',
    flex: 1,
    width: '100%',
    borderRadius: 30,
    backgroundColor: '#FFF',
    paddingBottom: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 1
  },
  containerResidence:{
    fontSize: hp('3.5%'),
    fontFamily: 'Raleway-Black',
    marginTop: 10,
    marginBottom: 20
  },
  dayPicker:{
    width: wp('20%'),
    minWidth: 110,
  },
  hor:{
    flex: 1,
    borderColor: '#000',
    width: '100%',
    borderWidth: 1,
    borderRadius: 30
  },
  loading:{
    height: '100%',
    justifyContent: 'center'
  },
  centerText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: hp('2.1%'),
  },
  horGuide:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderTopLeftRadius: 29,
    borderTopRightRadius: 29,
  },
  horGuideText:{
    color: '#FFF',
    fontSize: hp('2.1%'),
    fontFamily: 'Raleway-MediumItalic'
  },
  horSection:{
    height: '77.2%'
  },
  turn:{
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 17,
    borderBottomWidth: 1,
  },
  full:{
    opacity: .4,
    backgroundColor: 'gray',
    paddingVertical: 10,
  },
  nonHorText:{
    fontSize: 17,
    color: 'gray',
    textTransform: 'uppercase',
    height: '100%',
    textAlignVertical: 'center'
  },
})
