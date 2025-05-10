import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RouteProp, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Model, SerializableModel } from '../types';
import ChatTab from '../components/ChatTab';
import AgentsTab from '../components/AgentsTab';
import { RootStackParamList } from '../App';

const Tab = createBottomTabNavigator();

// Use the route type from our app's navigation types
type ModelDetailScreenRouteProp = RouteProp<RootStackParamList, 'ModelDetail'>;

const ModelDetailScreen: React.FC = () => {
  // Use the useRoute hook to get the route, which is properly typed
  const route = useRoute<ModelDetailScreenRouteProp>();
  const serializableModel = route.params.model;
  
  // Convert the serializable model back to a model with a Date object
  const model: Model = {
    ...serializableModel,
    dateDownloaded: new Date(serializableModel.dateDownloaded)
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#EEEEEE',
          backgroundColor: 'white',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Chat" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chat" color={color} size={size} />
          ),
        }}
      >
        {props => <ChatTab {...props} model={model} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Agents" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="robot" color={color} size={size} />
          ),
        }}
      >
        {props => <AgentsTab {...props} model={model} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default ModelDetailScreen;