import React from 'react'

import gymImage from '../../img/switch-gym.jpg'
import poolImage from '../../img/switch-pool.jpg'
import restImage from '../../img/switch-restaurant.jpg'
import churchImage from '../../img/switch-church.jpg'
import oldsroomImage from '../../img/switch-oldsroom.jpg'
import childsroomImage from '../../img/switch-childsroom.jpg'
import saunaImage from '../../img/switch-sauna.jpg'
import turkImage from '../../img/switch-turk.jpg'
import pingpongImage from '../../img/switch-pingpong.jpg'
import courtImage from '../../img/switch-court.jpg'

import {  
  ScrollView,
  Text, 
  StyleSheet, 
  ImageBackground
} from 'react-native'

export default function Switch( { navigation, route } ) {

  const { places, actualUser } = route.params

  return (
    <ScrollView contentContainerStyle={{
      flexGrow: 1,
      justifyContent: 'center',
    }}>
      {
        places.map((element) => {

          const place = element.place
          let placeText, img;

          if(place === 'gym'){
            img = gymImage
            placeText = 'Gimnasio'
          }else if(place === 'pool'){
            img = poolImage
            placeText = 'Piscina'
          }else if(place === 'church'){
            img = churchImage
            placeText = 'Iglesia'
          }else if(place === 'rest'){
            img = restImage
            placeText = 'Restaurante'
          }else if(place === 'turk'){
            img = turkImage
            placeText = 'Turco'
          }else if(place === 'sauna'){
            img = saunaImage
            placeText = 'Sauna'
          }else if(place === 'pingpong'){
            img = pingpongImage
            placeText = 'Ping-Pong'
          }else if(place === 'oldsroom'){
            img = oldsroomImage
            placeText = 'Zona adulto mayor'
          }else if(place === 'childsroom'){
            img = childsroomImage
            placeText = 'Zona infantil'
          }else if(place === 'court'){
            img = courtImage
            placeText = 'Cancha'
          }

          return <ImageBackground source={img} key={place} style={styles.place} imageStyle={styles.imgPlace}>
              <Text 
                style={styles.textPlace} 
                onPress={() => {
                  navigation.navigate('Schedule', { actualUser: actualUser, place: place, back: true })
                }}>
                {placeText}
              </Text>
          </ImageBackground>
        })
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  place:{
    height: 250,
    marginVertical: 10,
    width: '95%',
    alignSelf: 'center',
  },
  imgPlace:{
    borderRadius: 20,
    width: '100%',
    alignSelf: 'center',
  },
  textPlace:{
    textAlignVertical: 'center',
    textAlign: 'center',
    color:  '#FFF',
    fontSize: 50,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowRadius: 2,
    textShadowOffset: {
      height: 2,
      width: 2
    },
    width: '100%',
    height: '100%',
  }
})
