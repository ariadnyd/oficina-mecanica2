from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from .models import OrdemServico
from veiculos.models import Veiculo
from clientes.models import Cliente # Ajuste o caminho se o nome do app for diferente

class OrdemServicoViewSetTestCase(APITestCase):
    
    def setUp(self):
        # 1. Configura o cliente de teste e autenticação
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username='admin_os', 
            password='senha_teste', 
            email='admin@oficina.com'
        )
        self.client.force_authenticate(user=self.admin_user)
        
        # 2. Criação da base necessária (Cliente -> Veículo)
        self.cliente_teste = Cliente.objects.create(
            nome="Cliente da OS",
            cpf="12345678900",
            data_nascimento="1980-01-01"
        )
        
        self.veiculo_teste = Veiculo.objects.create(
            marca="Honda",
            modelo="Civic",
            placa="ABC-1234",
            cliente=self.cliente_teste
        )
        
        # 3. Cria uma OS base para os testes de Consultar, Atualizar e Deletar
        self.os_teste = OrdemServico.objects.create(
            veiculo=self.veiculo_teste,
            status="aberto"
        )
        
        # 4. Define as URLs base
        self.url_lista = '/api/ordens-servico/'
        self.url_detalhe = f'/api/ordens-servico/{self.os_teste.id}/'

    # ----------------------------------------------------
    # TESTES DE CRIAÇÃO (POST)
    # ----------------------------------------------------
    def test_abrir_ordem_servico_com_sucesso(self):
        """Testa a abertura de uma nova OS vinculada a um veículo"""
        dados_nova_os = {
            "veiculo": self.veiculo_teste.id,
            "status": "aberto"
        }
        
        response = self.client.post(self.url_lista, dados_nova_os, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['mensagem'], "Ordem de Serviço aberta com sucesso!")
        # Verifica se agora temos 2 OS no banco (1 do setUp + 1 deste teste)
        self.assertEqual(OrdemServico.objects.count(), 2)

    def test_abrir_ordem_servico_sem_veiculo(self):
        """Testa o bloqueio de abertura de OS sem informar um veículo"""
        dados_invalidos = {
            "status": "orcamento"
            # 'veiculo' foi propositalmente omitido
        }
        
        response = self.client.post(self.url_lista, dados_invalidos, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data['erro'], 
            "Erro: Não é possível abrir a Ordem de Serviço. É necessário selecionar um veículo válido."
        )

    # ----------------------------------------------------
    # TESTE DE CONSULTA (GET)
    # ----------------------------------------------------
    def test_consultar_ordem_servico(self):
        """Testa a leitura dos dados de uma OS específica"""
        response = self.client.get(self.url_detalhe)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['veiculo'], self.veiculo_teste.id)
        self.assertEqual(response.data['status'], "aberto")

    # ----------------------------------------------------
    # TESTE DE ATUALIZAÇÃO (PATCH)
    # ----------------------------------------------------
    def test_atualizar_status_ordem_servico(self):
        """Testa a mudança de status da OS (ex: Em aberto -> Finalizado)"""
        novos_dados = {
            "status": "finalizado"
        }
        
        response = self.client.patch(self.url_detalhe, novos_dados, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Puxa os dados atualizados do banco para conferir
        self.os_teste.refresh_from_db()
        self.assertEqual(self.os_teste.status, "finalizado")

    # ----------------------------------------------------
    # TESTE DE EXCLUSÃO LÓGICA (DELETE)
    # ----------------------------------------------------
    def test_cancelar_ordem_servico_soft_delete(self):
        """Testa se o DELETE apenas muda o status para 'cancelado' em vez de apagar do banco"""
        response = self.client.delete(self.url_detalhe)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['mensagem'], "A Ordem de Serviço foi cancelada com sucesso!")
        
        # Verifica se a OS AINDA existe no banco
        self.assertEqual(OrdemServico.objects.count(), 1)
        
        # Verifica se o status mudou para 'cancelado'
        self.os_teste.refresh_from_db()
        self.assertEqual(self.os_teste.status, "cancelado")