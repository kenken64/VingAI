import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Model } from '../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Agent {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
}

interface AgentsTabProps {
  model: Model;
}

const AgentsTab: React.FC<AgentsTabProps> = ({ model }) => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Assistant',
      description: 'A helpful AI assistant',
      systemPrompt: 'You are a helpful assistant.',
    },
    {
      id: '2',
      name: 'Coder',
      description: 'Helps with programming tasks',
      systemPrompt: 'You are a code assistant. Provide clear, concise, and efficient code examples.',
    },
  ]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDescription, setNewAgentDescription] = useState('');
  const [newAgentSystemPrompt, setNewAgentSystemPrompt] = useState('');

  const addAgent = () => {
    if (newAgentName.trim() === '') return;
    
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: newAgentName,
      description: newAgentDescription,
      systemPrompt: newAgentSystemPrompt,
    };
    
    setAgents((prev) => [...prev, newAgent]);
    resetForm();
  };

  const resetForm = () => {
    setNewAgentName('');
    setNewAgentDescription('');
    setNewAgentSystemPrompt('');
    setModalVisible(false);
  };

  const renderAgent = ({ item }: { item: Agent }) => (
    <TouchableOpacity style={styles.agentCard}>
      <View style={styles.agentHeader}>
        <Icon name="robot" size={24} color="#4A90E2" />
        <Text style={styles.agentName}>{item.name}</Text>
      </View>
      <Text style={styles.agentDescription}>{item.description}</Text>
      <View style={styles.promptContainer}>
        <Text style={styles.promptLabel}>System Prompt:</Text>
        <Text style={styles.systemPrompt}>{item.systemPrompt}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Agents for {model.name}</Text>
        <Text style={styles.subtitle}>Create and manage specialized AI agents</Text>
      </View>
      
      <FlatList
        style={styles.agentList}
        data={agents}
        renderItem={renderAgent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
      
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Agent</Text>
            
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={newAgentName}
              onChangeText={setNewAgentName}
              placeholder="Agent name"
            />
            
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={newAgentDescription}
              onChangeText={setNewAgentDescription}
              placeholder="What this agent does"
            />
            
            <Text style={styles.label}>System Prompt</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newAgentSystemPrompt}
              onChangeText={setNewAgentSystemPrompt}
              placeholder="Instructions for the AI"
              multiline
              numberOfLines={4}
            />
            
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={resetForm}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={addAgent}
                disabled={newAgentName.trim() === ''}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  agentList: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  agentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  agentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  agentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  agentDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  promptContainer: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 6,
  },
  promptLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#888888',
    marginBottom: 4,
  },
  systemPrompt: {
    fontSize: 14,
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#F9F9F9',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#EEEEEE',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default AgentsTab;