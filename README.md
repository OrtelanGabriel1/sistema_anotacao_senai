Ocorrências SENAI - Sistema de Registro de Infrações

Aplicativo mobile desenvolvido para o registro e controle de infrações ao regulamento escolar do SENAI.
A solução conta com persistência de dados local e operações completas de CRUD.  

Campos do CadastroNome: Nome do aluno ou responsável envolvido.  
Número: Identificação/chamada do aluno (opcional). 
Sala: Local ou ambiente da ocorrência.  
Gravidade: Classificação entre Baixa, Média e Alta. 
Motivo: Descrição detalhada da infração. 
Data e Hora: Carimbo de data e horário gerado automaticamente no momento do salvamento.  
Foto/Print: Anexo opcional de imagem/comprovante da infração.  

Funcionalidades do Sistema (CRUD)Criar: Formulário para cadastrar uma nova ocorrência no regulamento com validação dos campos. 

Listar: Exibição detalhada de cartões com busca por texto e filtro de pendências.  
Concluir/Atualizar: Alteração do status da ocorrência entre "Pendente" e "Concluído". 
Excluir: Remoção definitiva do registro do banco local mediante confirmação. 

Tecnologias e BibliotecasReact Native & Expo: Estrutura base do projeto mobile.
AsyncStorage: Armazenamento offline de dados no formato chave-valor.

React Navigation (Native Stack): Gerenciamento das rotas entre a lista e o formulário. 
Organização dos Arquivossrc/screens/HomeScreen.js: Tela principal para listagem, filtros, busca, atualização e exclusão

src/screens/CadastroScreen.js: Tela de formulário dedicada para inserção de novas ocorrências.
src/components/AnotacaoCard.js: Componente para renderizar os dados do cartão e ações individuais. 
src/components/GravidadeSelector.js: Componente de botões seletores do nível de gravidade. 
src/services/storage.js: Camada de serviço responsável por ler, gravar e atualizar no AsyncStorage.  