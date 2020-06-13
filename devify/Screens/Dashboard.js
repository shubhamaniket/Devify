import React from 'react';
import {View,StyleSheet,Text,AsyncStorage, FlatList,Dimensions,TouchableOpacity,Image, ActivityIndicator,Modal,TouchableHighlight} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const {width,height} = Dimensions.get('window');

export default class Dashboard extends React.Component{
    state = {
        loading : true,
        posts : [],
        modalVisible : false
    }
    async componentDidMount(){
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
              // We have data!!
              console.log(value);
              fetch('https://devifyapp.herokuapp.com/getAllPosts',{
                  method : 'GET',
                  headers : {
                      'Content-Type' : 'application/json',
                      'Authorization' : `Bearer ${value}`
                  }
              })
              .then((res)=>res.json())
              .then((response)=>{
                  this.setState({
                      loading : false,
                      posts : response.data
                  })
                  console.log(this.state.posts)
              })
            }
          } catch (error) {
            // Error retrieving data
            console.log(error)
          }

    }
    logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            this.props.navigation.replace('LoginScreen')
        } catch (error) {
            console.log(error)
        }
    }
    render(){
        if(this.state.loading){
            return(
                <View style={styles.container}>
                    <Image
                    source={require('../assets/background.png')}
                    style={StyleSheet.absoluteFill}
                    />
                    <ActivityIndicator size="large" color="blue"/>
                </View>
            );
        }
        else{
            return(
                    <View style={styles.container}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                        alert('Modal has been closed.');
                        }}>
                        <View style={styles.modalView}>
                           <View style={{flex:1,alignItems:'flex-end'}}>
                                <TouchableOpacity onPress={()=>this.setState({
                                    modalVisible : !this.state.modalVisible
                                })}>
                                    <Text style={{fontSize:26,fontWeight:'bold',margin:10}}>X</Text>
                                </TouchableOpacity>
                           </View>
                           <View style={{flex:3,backgroundColor : 'yellow'}}>

                           </View>
                        </View>
                    </Modal>
                        <Image
                        source={require('../assets/background.png')}
                        style={StyleSheet.absoluteFill}
                        />
                        <View style={styles.boxone}>
                            <View style={{flex:3,alignItems:'center',justifyContent:'center'}}>
                                <Text style={styles.header}>Explore Dev Posts</Text>
                            </View>
                            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                <TouchableOpacity onPress={()=>this.logout()} style={{width:50,height:50,backgroundColor:'#fff',borderRadius:100}}>
                                    <Image source={require('../assets/user.png')} style={{width:50,height:50}}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.boxtwo}>
                            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                <TouchableOpacity style={styles.addpost} onPress={()=>this.setState({
                                    modalVisible : true
                                })}>
                                    <Text style={{fontSize:40}}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:1.5,alignItems:'flex-start',justifyContent:'center'}}>
                                <Text style={{fontSize:35,color:'#fff'}}>Add Post</Text>
                            </View>
                        </View>
                        <View style={styles.boxthree}>
                            <FlatList
                            showsVerticalScrollIndicator={false}
                            data={this.state.posts}
                            renderItem={({item})=>{
                                return(
                                    <View style={styles.post}>
                                        
                                    </View>
                                );
                            }}
                            keyExtractor={(item,index)=>item._id}
                            />
                        </View>
                    </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        alignItems : 'center',
        justifyContent : 'center'
    },
    boxone : {
        flex : 1,
        width : '100%',
        flexDirection : 'row'
    },
    boxtwo : {
        flex : 1,
        width : '100%',
        flexDirection : 'row'
    },
    boxthree : {
        flex : 5.5,
        width : '100%',
        alignItems:'center'
    },
    header : {
        fontWeight : 'bold',
        fontSize: 20,
        color : '#fff',
        fontFamily : 'Roboto'
    },
    addpost : {
        width : 70,
        height : 70,
        backgroundColor : '#fff',
        borderRadius : 100,
        alignItems:'center',
        justifyContent:'center'
    },
    post : {
        width : width - 50,
        height : 230,
        borderWidth : 1,
        borderColor : '#000',
        backgroundColor : '#fff',
        marginBottom : 20
    },
    modalView : {
        width:width-30,
        height:height/1.05,
        backgroundColor : '#fff',
        alignSelf : 'center',
        position : 'absolute',
        bottom : 0,
        borderWidth : 2
    }
})