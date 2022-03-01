import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Button, ScrollView, SafeAreaView, StatusBar, Picker, TouchableHighlight } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from "react-router-native";

export default function Camera() {
  const [pickedImagePath, setPickedImagePath] = useState('')
  
  const [data, setData] = useState([])

  const [selectedValue, setSelectedValue] = useState(0)

  const [redirect, setRedirect] = useState('')

  const getUsers = async () => {
    try {
        const value = await AsyncStorage.getItem('token')
            if(value !== null) {
                return fetch('http://149.91.89.133:6088/all', {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'token': value
                    },
                })
                .then((response) => response.json())
                .then((json) => setData(json))
                .catch((error) => {
                    console.error(error)
                })
            }else{
                return false
            }
        } catch(e) {
            console.log(e)
        }
    
  }

  const showImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      getUsers();
    }
  }

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
      setPickedImagePath(result.uri)
      getUsers()
    }
  }

  const sendTo = async (recipient) => {

    var data = new FormData();
    data.append('duration', selectedValue)
    data.append('to', recipient)
    data.append('image', { uri: pickedImagePath, name: 'test.png', type: 'image/png' })

    try {
      const value = await AsyncStorage.getItem('token')
          if(value !== null) {
              return fetch('http://149.91.89.133:6088/snap', {
                method: 'POST',
                body: data,
                headers:{  
                  "Content-Type": "multipart/form-data",
                  "token": value,
                  },
              })
                  .then((response) => response.json())
                  .then((responseJson) => {
          
                      var err = 'error_message' in responseJson ? true : false
                      if (err) {
                          alert(responseJson.error_message)
                      } else {
                          alert('SNAP IS SEND')
                          setRedirect(true)
                      }
          
                  })
                  .catch((error) => {
                      console.error(error)
                      alert(error)
                  })
          }else{
              return false
          }
      } catch(e) {
          console.log(e)
      }
  }

  let list = data.data;

  if(redirect){
    return <Redirect to="/chat" />
  }

  if(typeof list === 'undefined'){
      return (
        <View style={styles.screen}>
        <View style={styles.buttonContainer}>
            <Button onPress={showImagePicker} title="Select an image" />
            <Button onPress={openCamera} title="Open camera" />
        </View>

        <View style={styles.imageContainer}>
            {
            pickedImagePath !== '' && <Image
                source={{ uri: pickedImagePath }}
                style={styles.image}
            />
            }
        </View>
        </View>
    );
  }else{
    return (
        <View style={styles.screen}>
          <View style={styles.buttonContainer}>
              <Button onPress={showImagePicker} title="Select an image" />
              <Button onPress={openCamera} title="Open camera" />
          </View>

          <View style={styles.imageContainer}>
              {
              pickedImagePath !== '' && <Image
                  source={{ uri: pickedImagePath }}
                  style={styles.image}
              />
              }
          </View>
          <View style={styles.selectContainer}>
              <Text>Choose Duration:</Text>
              <Picker
                selectedValue={selectedValue}
                style={{ height: 50, width: 150 }}
                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
              >
                <Picker.Item label="--" value="0" />
                <Picker.Item label="2s" value="2" />
                <Picker.Item label="3s" value="3" />
                <Picker.Item label="4s" value="4" />
                <Picker.Item label="5s" value="5" />
                <Picker.Item label="6s" value="6" />
              </Picker>
            </View>
            <SafeAreaView style={styles.container}>
                <Text style={styles.text}>Choose the recipient:</Text>
                <ScrollView style={styles.list}>
                {list.map((item) => {
                  return <Button onPress={() => sendTo(item.email)} title={item.email} style={{ marginBottom: 25 }} key={item.email} />
                })}
                </ScrollView>
              </SafeAreaView>
        </View>
    );
  }
  
}

const styles = StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectContainer: {
      paddingTop: 10,
      paddingBottom: 50,
      alignItems: "center",
      height: 20
    },  
    buttonContainer: {
      width: 400,
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
    imageContainer: {
      padding: 15,
    },
    image: {
      width: 100,
      height: 200,
      resizeMode: 'cover',
      borderRadius: 20
    },
    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
    },
    list: {
      marginHorizontal: 20,
    },
    text: {
      fontSize: 15,
      textAlign: 'center',
      paddingBottom: 5,
      borderBottomWidth: 1,
      borderBottomColor: 'black',
      fontWeight: 'bold'
    }
  });