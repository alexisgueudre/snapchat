import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, SafeAreaView, TouchableHighlight } from "react-native";

import { Link, Redirect } from "react-router-native";
// import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Register extends Component {

    constructor (props){
        super(props)
        this.state = {
          email: null,
          password: null,
          redirect: false
        }

        this.onChangeEmail = this.onChangeEmail.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
        this.onSubmitForm = this.onSubmitForm.bind(this)
    }

    onChangeEmail (value) {
        this.setState({email: value})
    }

    onChangePassword (value) {
        this.setState({password: value})
    }

    onSubmitForm () {
            fetch('http://149.91.89.133:6088/inscription', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password
                })
            })
            .then((response) => response.json())
            .then((result) => {
                    this.setState({redirect: true})
                })
            .catch((error) => {
                console.error(error)
            })
    }

    render() {

        if(this.state.redirect){
            return <Redirect to="/login" />
        }

        // if(!localStorage.getItem("token")){
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: '25%'
                    }}>
                    <SafeAreaView>
                        <TextInput
                        type="TextInput"
                        name="email"
                        style={styles.input}
                        onChangeText={this.onChangeEmail}
                        placeholder='your@email.com' />
                        <TextInput
                        type="TextInput"
                        name="password"
                        style={styles.input}
                        onChangeText={this.onChangePassword}
                        secureTextEntry={true}
                        placeholder='*******' />  
                    </SafeAreaView>
                    <View>
                        <TouchableHighlight style={styles.button} onPress={this.onSubmitForm} >
                            <Text style={styles.textButton}>Sign In</Text>
                        </TouchableHighlight>
                    </View>
                    <View>
                        <Link to="/login">
                            <Text style={styles.linkText}>Or log in</Text>
                        </Link>
                    </View>
                </View>
            )
        // }else{
        //     return <Redirect to="/" />
        // }
    }
}

const styles = StyleSheet.create({
    input: {
        fontSize: 30,
        backgroundColor: 'white',
        marginBottom: 25,
        borderRadius: 7,
        color: 'gray',
        padding: 10
    },
    button: {
        backgroundColor: '#95CBCC',
        padding: 5,
        borderRadius: 7,
    },
    textButton: {
        textAlign: 'center',
        padding: 10,
        fontSize: 35,
        color: 'white',
        textShadowColor: 'black',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },
    linkText: {
        fontSize: 20,
        marginTop: 15,
        fontWeight: 'bold',
        color: 'black',
        textShadowColor: 'black',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 0.1
    }
})