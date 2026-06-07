import api from './api';

const clienteServices = {
  // Função para buscar todos os clientes no Django (GET)
  getClientes: async () => {
    try {
      const resposta = await api.get('clientes/'); // Puxa da URL base + 'clientes/'
      return resposta.data;
    } catch (erro) {
      console.error("Erro ao buscar clientes:", erro);
      return [];
    }
  },
  cadastrarCliente: async (dadosCliente) => {
    try {
      // Envia os dados do formulário para o Django
      const resposta = await api.post('clientes/', dadosCliente);
      return resposta.data;
    } catch (erro) {
      console.error("Erro ao cadastrar cliente:", erro);
      throw erro; // Repassa o erro para a tela tratar
    }
  }
  
};

export default clienteServices;