import { StatusBar } from 'expo-status-bar';
import React from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native"
import { NativeRouter, Route, Link, Redirect } from "react-router-native"

import Home from "./app/components/Home"
import Chat from "./app/components/Chat"
import Help from "./app/components/Help"
import Login from "./app/components/Login"
import Register from "./app/components/Register"
import Camera from "./app/components/Camera"

function App() {
  return (
      <NativeRouter>
        <View style={styles.container}>
          <View style={styles.page}>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/chat" component={Chat} />
            <Route path="/help" component={Help} />
            <Route path="/camera" component={Camera} />
          </View>
          <View style={styles.menubar}>
            <Link to="/" style={styles.link}>
              <Image source={require('./app/assets/home.png')} style={styles.icon} />
            </Link>
            <Link to="/chat" style={styles.link}>
              <Image source={require('./app/assets/chat.png')} style={styles.icon} />
            </Link>
            <Link to="/help" style={styles.link}>
              <Image source={require('./app/assets/help.png')} style={styles.icon} />
            </Link>
          </View>
        </View>
      </NativeRouter>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FBE7A3",
    flex: 1,
    justifyContent: "center"
  },
  page: {
    height: '90%'
  },
  menubar: {
    backgroundColor: "#FFFCD6",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  icon: {
    height: 40,
    width: 40
  }
})

export default App