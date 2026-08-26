import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  getAnotacoes,
  atualizarStatusAnotacao,
  excluirAnotacao,
} from '../services/storage';

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

  const getGravidadeColor = (gravidade) => {
    switch (gravidade) {
      case 'Alta':
        return '#DC3545';
      case 'Média':
        return '#FFC107';
      case 'Baixa':
        return '#28A745';
      default:
        return '#6C757D';
    }
  };

  const formatarData = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.nomeText}>
            {item.nome} {item.numero ? `(#${item.numero})` : ''}
          </Text>
          <Text style={styles.salaText}>📍 Sala: {item.sala}</Text>
        </View>
        <View
          style={[
            styles.badgeGravidade,
            { backgroundColor: getGravidadeColor(item.gravidade) },
          ]}
        >
          <Text style={styles.badgeGravidadeText}>{item.gravidade}</Text>
        </View>
      </View>

      <Text style={styles.motivoText}>{item.motivo}</Text>

      {item.fotoUri && (
        <Image source={{ uri: item.fotoUri }} style={styles.cardImage} />
      )}

      <Text style={styles.dataText}>🕒 {formatarData(item.dataHora)}</Text>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={[
            styles.statusBtn,
            item.status === 'Concluído' ? styles.statusConcluido : styles.statusPendente,
          ]}
          onPress={() => handleToggleStatus(item)}
        >
          <Text style={styles.statusBtnText}>
            {item.status === 'Concluído' ? '✓ Concluído' : '⏳ Marcar Concluído'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleExcluir(item.id)}
        >
          <Text style={styles.deleteBtnText}>🗑️ Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
        renderItem={renderCard}
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
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  salaText: {
    fontSize: 13,
    color: '#6C757D',
    marginTop: 2,
  },
  badgeGravidade: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeGravidadeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  motivoText: {
    fontSize: 14,
    color: '#333',
    marginVertical: 6,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginVertical: 8,
  },
  dataText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
  },
  statusBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  statusPendente: {
    backgroundColor: '#FFF3CD',
  },
  statusConcluido: {
    backgroundColor: '#D4EDDA',
  },
  statusBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  deleteBtnText: {
    fontSize: 12,
    color: '#DC3545',
    fontWeight: 'bold',
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