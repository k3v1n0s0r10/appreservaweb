import React, { useState, useEffect } from 'react'

import { Picker } from '@react-native-community/picker'

import { 
  View
} from 'react-native'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBuilding } from '@fortawesome/free-solid-svg-icons'
import { FlatList } from 'react-native-gesture-handler'

export default function SelectResidence( { estype, styles, residence, setResidence } ) {

  const [ loading, setLoading ] = useState(true)
  const [ residencesGet, setResidencesGet ] = useState('')

  useEffect(() => {
    getResidences()
    //eslint-disable-next-line
  },[estype])

  const getResidences = () => {
    setLoading(true)
    fetch('https://api-gestion.mascentigrados.com/getresidences',{
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        residencesGet: residencesGet,
        estype: estype
      })
    })
    .then(response => response.json())
    .then(data => {
      data.sort(function (a, b) {
        if (a.residence > b.residence) {
          return 1;
        }
        if (a.residence < b.residence) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });

      setResidencesGet(data)
      setLoading(false)
    })
    .catch(err => console.log(err))
  }

  if(loading){
    return(
      <View style={styles.pickerSection}>
        <Picker
          style={styles.picker}
        >
          <Picker.Item 
            label="Cargando..."
            value="."
          />
        </Picker> 
        <FontAwesomeIcon 
          icon={faBuilding}
          size={25}
          style={styles.pickerIcon}
        />
      </View> 
    )
  }else{
    return(
      <View style={styles.pickerSection}>
        <Picker
          style={styles.picker}
          selectedValue={residence}
          onValueChange={(value) => setResidence( oldInfo => ({
            ...oldInfo,
            residence: value
          }))}
        >
          <Picker.Item 
            label="Establecimiento"
            value="."
          />
          {/* <FlatList 
            keyExtractor={( { item } ) =>  item.residence}
            data={residencesGet}
            renderItem={( { item } ) => (
              <Picker.Item
                label={item.residence.toUpperCase()}
                value={item.residence}
              />
            )}
          /> */}
          {
            residencesGet.map( (element) => {
              return(
                <Picker.Item
                  key={element.residence}
                  label={element.residence.toUpperCase()}
                  value={element.residence}
                />
                )
              })
            }
        </Picker> 
        <FontAwesomeIcon 
          icon={faBuilding}
          style={styles.pickerIcon}
          size={30}
        />
      </View> 
    )
  }
}
