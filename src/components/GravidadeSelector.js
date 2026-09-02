import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function GravidadeSelector({ selecionado, onSelect }) {
  const opcoes = ['Baixa', 'Média', 'Alta'];

  return (
    <View style={styles.container}>
      {opcoes.map((item) => {
        const isSelected = selecionado === item;
        return (
          <TouchableOpacity
            key={item}
            style={[
              styles.btn,
              isSelected && styles[`btn_${item}`],
            ]}
            onPress={() => onSelect(item)}
          >
            <Text style={[styles.text, isSelected && styles.textSelected]}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 3,
    backgroundColor: '#FFF',
  },
  btn_Baixa: {
    backgroundColor: '#28A745',
    borderColor: '#28A745',
  },
  btn_Média: {
    backgroundColor: '#FFC107',
    borderColor: '#FFC107',
  },
  btn_Alta: {
    backgroundColor: '#DC3545',
    borderColor: '#DC3545',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  textSelected: {
    color: '#FFF',
  },
});