import 'react-native-get-random-values';
import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getDownloadedModels, deleteGGUFModel } from './utils/fileSystem';
import { Model, SerializableModel } from './types';

// Import screens
import HomeScreen from './screens/HomeScreen';
import ModelDetailScreen from './screens/ModelDetailScreen';

// Define the navigation types
export type RootStackParamList = {
  Home: undefined;
  ModelDetail: { model: SerializableModel };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [downloadedModels, setDownloadedModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const models = await getDownloadedModels();
        setDownloadedModels(models);
      } catch (error) {
        console.error('Failed to load models:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  const handleModelDownloaded = (model: Model) => {
    setDownloadedModels((prevModels) => [...prevModels, model]);
  };

  const handleModelDelete = async (model: Model) => {
    try {
      await deleteGGUFModel(model.path);
      setDownloadedModels((prevModels) => 
        prevModels.filter((m) => m.id !== model.id)
      );
    } catch (error) {
      console.error("Failed to delete model:", error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#4A90E2" 
        translucent={Platform.OS === 'android'} 
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4A90E2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Home">
            {(props) => (
              <HomeScreen
                {...props}
                models={downloadedModels}
                isLoading={isLoading}
                onModelDownloaded={handleModelDownloaded}
                onModelDelete={handleModelDelete}
              />
            )}
          </Stack.Screen>
          <Stack.Screen 
            name="ModelDetail"
            component={ModelDetailScreen}
            options={({ route }) => ({ 
              title: route.params.model.name 
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;