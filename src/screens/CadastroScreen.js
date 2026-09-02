import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { salvarAnotacao } from '../services/storage';
import GravidadeSelector from '../components/GravidadeSelector';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [numero, setNumero] = useState('');
  const [sala, setSala] = useState('');
  const [motivo, setMotivo] = useState('');
  const [gravidade, setGravidade] = useState('Baixa');

  const handleSalvar = async () => {
    if (!nome || !sala || !motivo) {
      Alert.alert('Atenção', 'Preencha os campos obrigatórios: Nome, Sala e Motivo.');
      return;
    }

    const novaAnotacao = {
      nome,
      numero,
      sala,
      motivo,
      gravidade,
    };

    const sucesso = await salvarAnotacao(novaAnotacao);
    if (sucesso) {
      Alert.alert('Sucesso', 'Anotação publicada com sucesso!');
      navigation.goBack();
    } else {
      Alert.alert('Erro', 'Não foi possível salvar a anotação.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nome do Aluno/Responsável *</Text>
      <TextInput 
        style={styles.input} 
        value={nome} 
        onChangeText={setNome} 
      />

      <Text style={styles.label}>Número (Opcional)</Text>
      <TextInput 
        style={styles.input} 
        value={numero} 
        onChangeText={setNumero} 
        keyboardType="numeric" 
      />

      <Text style={styles.label}>Sala / Local *</Text>
      <TextInput 
        style={styles.input} 
        value={sala} 
        onChangeText={setSala} 
      />

      <Text style={styles.label}>Gravidade</Text>
      <GravidadeSelector selecionado={gravidade} onSelect={setGravidade} />

      <Text style={styles.label}>Motivo / Descrição *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={motivo}
        onChangeText={setMotivo}
        placeholder="Descreva a ocorrência..."
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
        <Text style={styles.btnSalvarText}>Publicar Anotação</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F7FA' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginTop: 12, marginBottom: 4 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, fontSize: 14 },
  textArea: { height: 100, textAlignVertical: 'top' },
  btnSalvar: { 
    backgroundColor: '#E52225', // Cor Vermelha
    padding: 16, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 24, 
    marginBottom: 40 
  },
  btnSalvarText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});