import React from 'react';
import {View,StyleSheet,Text,AsyncStorage, FlatList,Dimensions,TouchableOpacity,Image, TextInput,ActivityIndicator,Modal,TouchableHighlight} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons'; 
const {width,height} = Dimensions.get('window');

export default class Dashboard extends React.Component{
    state = {
        loading : true,
        posts : [],
        modalVisible : false,
        title : '',
        content : '',
        thumbnail : '',
        showcheck : false,
        indicator : false
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
    afterUpload = () => {
        if(this.state.showcheck){
            return(
                <AntDesign name="check" size={32} color="white" />
            );
        }
        else{
            return(
                <Text style={{color:'#fff',fontSize:20,lineHeight:23}}>Upload Photo</Text>
            );
        }
    }
    addPost = async () =>{
        this.setState({
            indicator : true
        })
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
              fetch('https://devifyapp.herokuapp.com/createPost',{
                  method : 'POST',
                  headers : {
                      'Content-Type' : 'application/json',
                      'Authorization' : `Bearer ${value}`
                  },
                  body : JSON.stringify({
                      title : this.state.title,
                      content : this.state.content,
                      image : this.state.thumbnail
                  })
              })
              .then((res)=>res.json())
              .then((response)=>{
                  if(response.success === false){
                      alert(response.message)
                      this.setState({
                          indicator : false
                      })
                  }
                  else{
                      alert(response.message)
                      this.setState({
                          modalVisible : !this.state.modalVisible,
                          title : '',
                          content : '',
                          thumbnail : '',
                          showcheck : false,
                          indicator : false
                      })
                      this.componentDidMount()
                  }
              })
            }
          } catch (error) {
            // Error retrieving data
            console.log(error)
          }
    }
    pickfromgallery = async () => {
        const {granted} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if(granted){
            let data = await ImagePicker.launchImageLibraryAsync({
                mediaTypes : ImagePicker.MediaTypeOptions.Images,
                allowsEditing : true,
                aspect : [1,1],
                quality : 0.5
            })
            if(!data.cancelled){
                let newfile = {
                    uri : data.uri,
                    type : `test/${data.uri.split(".")[1]}`,
                    name : `test.${data.uri.split(".")[1]}`
                }
                this.uploadImage(newfile)
            }
        }
        else{
            alert("You need to give Permission to upload Photo")
        }
    }
    uploadImage = (image) => {
        const data = new FormData()
        data.append('file',image)
        data.append('upload_preset','devify')
        data.append('cloud_name','dknknjpjq')

        fetch('https://api.cloudinary.com/v1_1/dknknjpjq/image/upload',{
            method : 'POST',
            body : data
        })
        .then((res)=>res.json())
        .then((response)=>{
            console.log(response)
            this.setState({
                showcheck : true,
                thumbnail : response.secure_url
            })
        })
        .catch((err)=>console.log(err))
    }
    showindicator = () => {
        if(this.state.indicator){
            return(
                <ActivityIndicator size="small" color="#fff"/>
            );
        }
        else{
            return(
                <Text style={{color:'#fff',fontSize:20,lineHeight:23}}>Add Post</Text>
            );
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
                <SafeAreaView style={{flex:1}}>
                    <View style={styles.container}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                        alert('Modal has been closed.');
                        }}>
                        <View style={styles.modalView}>
                           <View style={{flex:0.8,alignItems:'flex-end'}}>
                                <TouchableOpacity onPress={()=>this.setState({
                                    modalVisible : !this.state.modalVisible,
                                    title : '',
                                    content : '',
                                    thumbnail : '',
                                    showcheck : false
                                })}>
                                    <Text style={{fontSize:26,fontWeight:'bold',margin:10}}>X</Text>
                                </TouchableOpacity>
                           </View>
                           <View style={{flex:0.8,padding:15}}>
                                <TextInput
                                    placeholder="Enter Title"
                                    multiline={true}
                                    placeholderTextColor="rgba(0, 0, 0, 0.2)"
                                    style={{fontSize:35,color:'rgba(0, 0, 0, 0.2)'}}
                                    onChangeText={(text)=>this.setState({
                                        title : text
                                    })}
                                />
                           </View>
                           <View style={{flex:9,margin:15,borderWidth:1,padding:5}}>
                                <TextInput
                                    placeholder="Write something here !"
                                    multiline={true}
                                    style={{fontSize:20}}
                                    onChangeText={(text)=>this.setState({
                                        content : text
                                    })}
                                />
                           </View>
                           <View style={{flex:2}}>
                                <TouchableOpacity 
                                onPress={this.pickfromgallery}
                                style={{flex:1,backgroundColor:'#282087',marginLeft:13,marginRight:13,marginBottom:5,alignItems:'center',justifyContent:'center'}}>
                                    {this.afterUpload()}
                                </TouchableOpacity>
                                <TouchableOpacity 
                                onPress={()=>this.addPost()}
                                style={{flex:1,backgroundColor:'#208749',marginLeft:13,marginRight:13,alignItems:'center',justifyContent:'center'}}>
                                    {this.showindicator()}
                                </TouchableOpacity>
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
                                        <View style={{flex:4,borderRightWidth:1}}>

                                        </View>
                                        <View style={{flex:1}}>
                                            <TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                                <Image source={require('../assets/favorite.png')} style={{width:32,height:32}}/>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                                <Image source={require('../assets/share.png')} style={{width:32,height:32}}/>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            }}
                            keyExtractor={(item,index)=>item._id}
                            />
                        </View>
                    </View>
                </SafeAreaView>
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
        marginBottom : 20,
        borderRadius : 15,
        flexDirection : 'row'
    },
    modalView : {
        width:width-20,
        height:height/1,
        backgroundColor : '#f2f2ff',
        alignSelf : 'center',
        position : 'absolute',
        top : 0
    }
})