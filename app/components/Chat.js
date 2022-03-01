import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Button, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from "react-router-native"

export default function Chat() {
    const [data, setData] = useState([]);
    const [snap, setSnap] = useState([])
    const [duration, setDuration] = useState('')
    const [snapId, setSnapId] = useState('')
    const [redirect, setRedirect] = useState('')

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('token')
            if(value !== null) {
                return fetch('http://149.91.89.133:6088/snaps', {
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
                setData(null)
            }
        } catch(e) {
            console.log(e)
        }
    }

    if(data === null){
        return <Redirect to="/" />
    }

    if(data.length === 0){
        getData()
    }

    const showSnap = async (id) => {
        setSnapId(id)
        try {
            const value = await AsyncStorage.getItem('token')
            if(value !== null) {
                const req = new Request('http://149.91.89.133:6088/snap/' + id, {
                    method: 'GET',
                    headers: {
                        'token': value
                    }
                });
                return fetch(req)
                    .then(response => response.json())
                    .then(result => {
                        setSnap(result.data.image.link)
                        setDuration(result.data.duration)
                    })
                    .catch((e) => {
                        console.log(e)
                    })
            }else{
                setSnap(null)
            }
        } catch(e) {
            console.log(e)
        }
    }

    const seenSnap = async () => {
            try {
                const value = await AsyncStorage.getItem('token')
                if(value !== null) {
                    const req = new Request('http://149.91.89.133:6088/seen', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'token': value
                        },
                        body: JSON.stringify({
                            id: snapId
                        })
                    })
                    return fetch(req)
                        .then(response => {
                            if(response !== null){
                                response.json()}})
                        .then(result => {
                            setSnapId(null)
                            setRedirect(true)
                        })
                        .catch((e) => {
                            console.log(e)
                        })
                }else{
                    return;
                }
            } catch(e) {
                console.log(e)
            }
    }

    let snaps = data.data

    if(redirect){
        return <Redirect to="/" />
      }

    if(snap.length !== 0 && duration > 0){

            for (let i = 0; i < duration; i++) {
                setTimeout(()=>{ 
                    setDuration(duration - 1)
                    if(duration === 1){
                        setTimeout(() => {
                          seenSnap() 
                        }, 1000);
                    }
                }, 1000)
            }

        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Text style={{
                    position: 'absolute',
                    bottom: '5%',
                    color: 'red',
                    zIndex: 100000000,
                    backgroundColor: 'white',
                    textAlign: "center",
                    fontSize: 25,
                    width: '50%',
                    borderRadius: 50
                }}>{duration}</Text>
                <Image source={{
                    uri: `http://149.91.89.133:6088${snap}`
                }} style={{
                    width: '100%',
                    height: '100%',
                    zIndex: 1000,
                    opacity: 1,
                    position: 'absolute',
                    resizeMode: 'cover',
                }} />
            </View>
        )
    }else{
        if(typeof snaps === 'undefined'){
            return(
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: 15,
                        fontWeight: 'bold'
                    }}>Loading...</Text>
                </View>
            )
        }else if(snaps.length === 0){
            return(
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: 15,
                        fontWeight: 'bold'
                    }}>There is nothing for you</Text>
                </View>
            )
        }else{
            return (
                <SafeAreaView style={styles.container}>
                    <Text style={styles.text}>New snaps:</Text>
                    <ScrollView style={styles.list}>
                        {snaps.map((item) => {
                            return (
                                <View style={styles.item} key={item._id}>
                                    <Button onPress={() => showSnap(item._id)} title={'From: ' + item.from} key={item._id} />
                                </View>
                            )

                        })}
                    </ScrollView>
                </SafeAreaView>
            )
        }
    }


}

const styles = StyleSheet.create({
    text: {
        marginTop: 25,
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    list: {
        marginHorizontal: 20,
    },
    item: {
        marginTop: 10,
        alignSelf: 'center',
        minWidth: '75%',
        borderRadius: 12
    }
});