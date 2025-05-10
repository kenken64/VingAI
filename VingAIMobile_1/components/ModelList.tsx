import React, { useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { Model } from '../types';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ModelListProps {
  models: Model[];
  onDeleteModel?: (model: Model) => void;
  onModelPress?: (model: Model) => void;
}

const ModelList: React.FC<ModelListProps> = ({ models, onDeleteModel, onModelPress }) => {
  // Store references to open swipeables so we can close them when needed
  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());

  if (models.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No models downloaded yet. Download a GGUF model to get started.
        </Text>
      </View>
    );
  }

  const renderRightActions = (model: Model, progress: Animated.AnimatedInterpolation<number>) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
    });

    return (
      <Animated.View style={[styles.rightAction, { transform: [{ translateX: trans }] }]}>
        <TouchableOpacity
          style={styles.deleteAction}
          onPress={() => {
            // Close the swipeable
            const swipeable = swipeableRefs.current.get(model.id);
            if (swipeable) {
              swipeable.close();
            }
            
            // Show confirmation dialog
            if (onDeleteModel) {
              Alert.alert(
                "Delete Model",
                `Are you sure you want to delete ${model.name}?`,
                [
                  { text: "Cancel", style: "cancel" },
                  { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: () => onDeleteModel(model)
                  }
                ]
              );
            }
          }}
        >
          <Icon name="delete" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderItem = ({ item }: { item: Model }) => (
    <Swipeable
      ref={(ref) => {
        if (ref && item.id) {
          swipeableRefs.current.set(item.id, ref);
        }
      }}
      renderRightActions={(progress) => renderRightActions(item, progress)}
      rightThreshold={40}
      friction={2}
      overshootRight={false}
    >
      <TouchableOpacity 
        style={styles.modelCard}
        onPress={() => onModelPress && onModelPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.modelCardContent}>
          <Text style={styles.modelName}>{item.name}</Text>
          <Text style={styles.modelPath}>{item.path}</Text>
          <Text style={styles.modelSize}>{formatFileSize(item.size)}</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#AAAAAA" />
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Downloaded Models</Text>
      <Text style={styles.instruction}>Tap on a model to open, swipe left to delete</Text>
      <FlatList
        data={models}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
  modelCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modelCardContent: {
    flex: 1,
  },
  modelName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modelPath: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  modelSize: {
    fontSize: 14,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 8,
  },
  rightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: 8,
  },
  deleteAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 4,
  },
});

export default ModelList;