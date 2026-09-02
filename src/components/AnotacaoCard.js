import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function AnotacaoCard({ item, onToggleStatus, onExcluir }) {
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

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerInfo}>
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
          onPress={() => onToggleStatus(item)}
        >
          <Text style={styles.statusBtnText}>
            {item.status === 'Concluído' ? '✓ Concluído' : '⏳ Marcar Concluído'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={() => onExcluir(item.id)}>
          <Text style={styles.deleteBtnText}>🗑️ Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerInfo: {
    flex: 1,
    marginRight: 8,
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
    lineHeight: 20,
  },
  cardImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginVertical: 8,
    resizeMode: 'cover',
  },
  dataText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});