import React, { Component } from 'react';
import { TouchableHighlight, StyleSheet, Text, Image, View } from "react-native";
import { Link } from "react-router-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from "react-router-native"

export default class Home extends Component {
    constructor (props){
        super(props)
        this.state = {
          token: null,
          loaded: false
        }
    }

    componentDidMount() {
        const getData = async () => {
            try {
            const value = await AsyncStorage.getItem('token')
                if(value !== null) {
                    this.setState({token: value,
                                loaded: true})
                }else{
                    this.setState({loaded: true})
                }
            } catch(e) {
                console.log(e)
            }
        }
        getData();
     }

    render(){
        if(this.state.loaded === true){
            if(this.state.token !== null){
                return <Redirect to="/camera" />
            }
            else{
                return (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "space-around",
                            alignItems: "center",
                            marginBottom: 50
                        }}>
                        <Image source={require('../assets/logo.png')} style={styles.logo} />
                        <Text style={styles.title}>MY SNAPI</Text>
                        <View style={{
                            marginTop: '30%'
                        }}>
                            <TouchableHighlight style={[styles.button1, styles.button]} >
                                <Link to="/login">
                                    <Text style={[styles.textButton]}>Log in</Text>
                                </Link>
                            </TouchableHighlight>
                            <TouchableHighlight style={[styles.button2, styles.button]}>
                                <Link to="/register">
                                    <Text style={styles.textButton}>Sign in</Text>
                                </Link>
                            </TouchableHighlight>
                        </View>
                    </View>
                )
            }
        }else{
            return (
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Text>Loading...</Text>
                </View>
            )
        }
        
    }

    
}

const styles = StyleSheet.create({
    logo: {
        width: "75%",
        height: "50%"
    },
    title: {
        fontWeight: 'bold',
        fontSize: 30,
        height: 50
    },
    button: {
        color: 'white',
        maxWidth: '80%',
        minWidth: '60%',
        borderRadius: 7
    },
    button1: {
        backgroundColor: '#FFBA67',
    },
    button2: {
        backgroundColor: '#95CBCC',
        marginTop: 20
    },
    textButton:{
        textAlign: 'center',
        padding: 15,
        fontSize: 45,
        color: 'white',
        textShadowColor: 'black',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },
    icon: {
        height: 40,
        width: 40
    }
  })


