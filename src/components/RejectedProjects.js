import React, { Component } from 'react';
import { Alert, Text, TouchableOpacity, View, Image, Button, Picker, FlatList, BackHandler } from 'react-native';
import { StackNavigator } from 'react-navigation';
import ModalDropdown from 'react-native-modal-dropdown';
import DeviceInfo from 'react-native-device-info';
import Notification from './common/Notification';
import Card from './common/Card';
import CardSection from './common/CardSection';
import { Spinner } from './common/Spinner';
import Img from './common/background';

var take;

const deviceId = DeviceInfo.getDeviceId();

class RejectedProjects extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'Rejected Projects',
            headerStyle: { backgroundColor: '#fad815' },
            headerRight: <Notification onPress={() => take.showNotifications()} count={params.countValue} navigation={navigation} />,
        }
    };

    constructor(props) {
        super(props);

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            user_email: this.props.navigation.state.params.Email,
            user_password: '',
            error: '',
            scrollEnabled: true,
            loading: true,
            itemVal: 0,
            package: [],
            dropDownData: ['1st Level', '2nd Level', '3rd Level'],
            level: 'Select Level',
            count: 0
        };
    }

    showNotifications() {
        // console.log("Hello Buwa");
        const { navigate } = this.props.navigation;
        navigate('Tenth', { Email: this.state.user_email });
    }

    goBack() {
        fetch('http://buwaneka-001-site1.1tempurl.com/logout.php')
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log(responseJson.results[0]);
                if (responseJson === 'NULL') {
                    const { navigate } = this.props.navigation;
                    navigate('First');
                }
            }).catch((error) => {
                // console.error(error);
                // Alert.alert(error);
                Alert.alert("No internet connection");
                // this.setState({ loading: false });
            });
    }

    logoutButton(itemValue) {
        if (itemValue === "Logout") {
            { this.goBack() }
        }
    }

    viewProjects(job_code) {
        // console.log(item);
        const { user_email, itemVal } = this.state;

        const { navigate } = this.props.navigation;
        navigate('Sixth', {
            Email: user_email,
            code: job_code,
            job_level: this.state.level
        });
    }

    renderListItem = ({ item }) => (
        <TouchableOpacity style={styles.linkStyle} key={item.Job_Code}>
            <View style={{ width: '20%', height: 70, alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text style={styles.textStyle}>{item.Job_Code}</Text>
            </View>
            <View style={{ width: '80%', height: 70, alignItems: 'flex-start', justifyContent: 'center', paddingRight: 5 }}>
                <Text style={styles.textStyle}>{item.Job_Name}</Text>
            </View>
        </TouchableOpacity>
    )

    onSelectOpt(idx, value) {
        this.setState({ level: value }, function () {
            // console.log(this.state.level);
            this.projectsList();
        });
    }

    projectsList() {
        fetch('http://buwaneka-001-site1.1tempurl.com/rejected_projects.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                job_level: this.state.level
            })

        }).then((response) => response.json())
            .then((responseJson) => {
                //console.log(responseJson.results);
                this.setState({ package: responseJson.results }, function () {
                    this.setState({ loading: false });
                });
            }).catch((error) => {
                // console.error(error);
                Alert.alert("No internet connection");
                this.setState({ loading: false });
            });
    }

    componentWillMount() {
        this.getCount();
        this.projectsList();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentDidMount() {
        this.props.navigation.setParams({
            countValue: this.state.count
        });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        // BackHandler.exitApp();
        const { navigate } = this.props.navigation;
        navigate('Second');
        return true;
    }

    getCount() {
        fetch('http://buwaneka-001-site1.1tempurl.com/getCount.php', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            deviceId: deviceId
          })
    
        }).then((response) => response.json())
          .then((responseJson) => {
            // console.log(responseJson);
            this.setState({ count: responseJson });
            this.props.navigation.setParams({
              countValue: this.state.count
            });
          }).catch((error) => {
            // console.error(error);
            // Alert.alert(error);
            Alert.alert("No internet connection");
            this.setState({ loading: false });
          });
      }


    completeView() {
        finalPakageDetails = this.state.package;
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100, height: 100 }}>
                    <Spinner size="large" spinnerStyle={styles.spinnerStyle} />
                </View>
            );
        }
        return (
            <FlatList
                data={finalPakageDetails}
                renderItem={this.renderListItem}
                keyExtractor={(item, index) => item.Job_Code}
                scrollEnabled={this.state.scrollEnabled}
            />
        );
    }

    render() {
        take = this;
        finalPakageDetails = this.state.package;
        return (
            <View style={{ flex: 1 }}>
                <Img />
                <Card>
                    <View style={styles.containerStyle1}>
                        <ModalDropdown options={this.state.dropDownData} onSelect={(idx, value) => this.onSelectOpt(idx, value)} style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.8)', height: 30, justifyContent: 'center', paddingLeft: 20 }} dropdownStyle={{ width: '80%', height: 100 }} dropdownTextStyle={{ color: '#000', fontSize: 15 }} dropdownTextHighlightStyle={{ fontWeight: 'bold' }} >
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: '70%' }}>
                                    <Text style={{ color: '#000', fontSize: 15 }}>{this.state.level}</Text>
                                </View>
                                <View style={{ width: '30%', alignItems: 'flex-end', paddingRight: 10 }}>
                                    <Image
                                        source={require('./pics/down.png')}
                                        style={styles.downStyle}
                                    />
                                </View>
                            </View>
                        </ModalDropdown>
                    </View>
                    <View style={styles.containerStyle}>
                        {this.completeView()}
                    </View>
                </Card>
            </View>
        )
    }
}


const styles = {
    viewStyle: {
        padding: 5,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        // marginBottom: '30%'
    },
    titleStyle: {
        fontSize: 20,
        paddingLeft: 20,
        flex: 1,
        color: '#000'
    },
    logoStyle: {
        height: '100%',
        width: 40
    },
    arrowStyle: {
        height: 20,
        width: 20
    },
    textStyle: {
        fontSize: 15,
        paddingLeft: 10,
        color: '#000'
    },
    containerStyle: {
        // borderBottomWidth: 1,
        padding: 5,
        justifyContent: 'flex-start',
        borderColor: '#ddd',
        position: 'relative',
    },
    iconStyle: {
        height: 40,
        width: 40
    },
    linkStyle: {
        width: '100%',
        height: 70,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        flexDirection: 'row',
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    containerStyle1: {
        borderBottomWidth: 1,
        padding: 5,
        justifyContent: 'flex-start',
        borderColor: '#ddd',
        position: 'relative',
        marginBottom: '20%'
    },
    downStyle: {
        width: 10,
        height: 10
    },
    spinnerStyle: {
        alignSelf: 'stretch',
        borderRadius: 5,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 60,
        paddingTop: 10,
        paddingBottom: 10,
        height: 100
    }
}

export default RejectedProjects;