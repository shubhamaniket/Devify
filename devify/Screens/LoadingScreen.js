import React from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  AsyncStorage
} from 'react-native';

export default class LoadingScreen extends React.Component{
    detectLogin = async () => {
        const token = await AsyncStorage.getItem('token')
        if(token){
            this.props.navigation.replace('Dashboard')
        }
        else{
            this.props.navigation.replace('LoginScreen')
        }
    }
    componentDidMount(){
        this.detectLogin();
    }
    render(){
        return (
            <View style={styles.loading}> 
                <ActivityIndicator size="large" color="blue" />
            </View>
        );
    }
}


const styles= StyleSheet.create({
    loading:{
     flex:1,
    justifyContent:"center",
    alignItems:"center" ,
    backgroundColor : '#fff'
    }
    
  })
