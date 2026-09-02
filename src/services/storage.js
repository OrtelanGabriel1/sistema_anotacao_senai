import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@senai_anotacoes';

export const getAnotacoes = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Erro ao buscar anotações:", e);
    return [];
  }
};

export const salvarAnotacao = async (novaAnotacao) => {
  try {
    const atuais = await getAnotacoes();
    const item = {
      id: Date.now().toString(),
      dataHora: new Date().toISOString(),
      status: 'Pendente',
      ...novaAnotacao
    };
    const atualizados = [item, ...atuais];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(atualizados));
    return true;
  } catch (e) {
    console.error("Erro ao salvar anotação:", e);
    return false;
  }
};

export const atualizarStatusAnotacao = async (id, novoStatus) => {
  try {
    const atuais = await getAnotacoes();
    const atualizados = atuais.map(item => 
      item.id === id ? { ...item, status: novoStatus } : item
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(atualizados));
    return true;
  } catch (e) {
    console.error("Erro ao atualizar anotação:", e);
    return false;
  }
};

export const excluirAnotacao = async (id) => {
  try {
    const atuais = await getAnotacoes();
    const atualizados = atuais.filter(item => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(atualizados));
    return true;
  } catch (e) {
    console.error("Erro ao excluir anotação:", e);
    return false;
  }
};