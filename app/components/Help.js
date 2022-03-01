import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import { Redirect } from "react-router-native"
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Help extends Component {

    constructor (props){
        super(props)
        this.state = {
          redirect: false,
          token: null,
          loaded: false
        }

        this.redirect = this.redirect.bind(this)
    }

    redirect (value) {
        this.setState({redirect: value})
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


    render() {
        const logOut = async () => {
            try {
                await AsyncStorage.removeItem('token')
                this.redirect(true)
              } catch(e) {
                console.log(e)
              }
        }

        if(this.state.redirect){
            return <Redirect to="/" />
        }

        let text = (
            <Text style={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in ultricies ante. Etiam rutrum nunc risus, eget mattis ligula feugiat sit amet. Mauris ultricies mattis arcu et cursus. Sed tristique ornare cursus. Phasellus ac massa vulputate, pellentesque nibh vitae, tempus justo. Fusce porta sapien nisl, nec semper quam lobortis eu.</Text>
        )

        if(this.state.loaded === true){
            if(this.state.token !== null){
                return (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                        {text}
        
                        <TouchableHighlight style={styles.button} onPress={logOut}>    
                            <Text style={styles.textButton}>Log out</Text>
                        </TouchableHighlight>
                        <Text style={styles.copyright}>Copyright 2021</Text>
                    </View>
                )
            }else{
                return (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                        {text}
                        <Text style={styles.copyright}>Copyright 2021</Text>
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
    button: {
        marginTop: 50,
        backgroundColor: '#FFFCD6',
        borderRadius: 7,
        padding: 10
    },
    textButton: {
        fontSize: 30,
    },
    text: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 7,
        maxWidth: "80%",
        fontSize: 15,
        lineHeight: 20
    },
    copyright: {
        marginTop: 50,
        fontStyle: 'italic'
    }
})
