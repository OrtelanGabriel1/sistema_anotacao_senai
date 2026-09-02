import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  getAnotacoes,
  atualizarStatusAnotacao,
  excluirAnotacao,
} from '../services/storage';
import AnotacaoCard from '../components/AnotacaoCard';

export default function HomeScreen({ navigation }) {
  const [anotacoes, setAnotacoes] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [busca, setBusca] = useState('');

  const carregarDados = async () => {
    const dados = await getAnotacoes();
    setAnotacoes(dados);
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const handleToggleStatus = async (item) => {
    const novoStatus = item.status === 'Pendente' ? 'Concluído' : 'Pendente';
    const sucesso = await atualizarStatusAnotacao(item.id, novoStatus);
    if (sucesso) {
      carregarDados();
    }
  };

  const handleExcluir = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja realmente excluir esta anotação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const sucesso = await excluirAnotacao(id);
            if (sucesso) carregarDados();
          },
        },
      ]
    );
  };

  const anotacoesFiltradas = anotacoes.filter((item) => {
    const atendeStatus =
      filtroStatus === 'Todos' || item.status === filtroStatus;
    const atendeBusca =
      item.nome.toLowerCase().includes(busca.toLowerCase()) ||
      item.sala.toLowerCase().includes(busca.toLowerCase()) ||
      item.motivo.toLowerCase().includes(busca.toLowerCase());
    return atendeStatus && atendeBusca;
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Buscar por nome, sala ou motivo..."
        value={busca}
        onChangeText={setBusca}
      />

      <View style={styles.filterContainer}>
        {['Todos', 'Pendente', 'Concluído'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterTab,
              filtroStatus === f && styles.filterTabActive,
            ]}
            onPress={() => setFiltroStatus(f)}
          >
            <Text
              style={[
                styles.filterTabText,
                filtroStatus === f && styles.filterTabTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={anotacoesFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AnotacaoCard
            item={item}
            onToggleStatus={handleToggleStatus}
            onExcluir={handleExcluir}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma anotação registrada.</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Cadastro')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 16,
  },
  searchBar: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#E9ECEF',
    marginHorizontal: 3,
  },
  filterTabActive: {
    backgroundColor: '#00519E',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#495057',
  },
  filterTabTextActive: {
    color: '#FFF',
  },
  listContainer: {
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#888',
    fontSize: 15,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#00519E',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: -2,
  },
});