from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.http import Http404
from .models import Cliente
from .serializers import ClienteSerializer

class ClienteViewSet(viewsets.ModelViewSet):
    serializer_class = ClienteSerializer
    # RN02 - Apenas usuários com perfil "Administrador" (is_staff=True no Django)
    # permission_classes = [IsAuthenticated, IsAdminUser] 

    def get_queryset(self):
        # Filtra apenas clientes ativos (não deletados logicamente)
        return Cliente.objects.filter(is_active=True)

    def get_object(self):
        try:
            # RN04 - Consulta prévia garantida pelo DRF ao buscar a instância
            return super().get_object()
        except Http404:
            # RN05 / MS05 - Cliente Inexistente
            raise Http404("Erro: O cliente informado não está cadastrado ou encontra-se suspenso.")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            # MS01 - Sucesso no Cadastro
            return Response({
                "mensagem": "Cliente cadastrado com sucesso!", 
                "dados": serializer.data
            }, status=status.HTTP_201_CREATED)
        
        # RN03 / MS04 - Dados Inválidos
        return Response({
            "mensagem": "Erro: Informações inválidas detectadas. Por favor, corrija os campos destacados e tente novamente.",
            "detalhes": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        
        try:
            instance = self.get_object()
        except Http404 as e:
            return Response({"erro": str(e)}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            self.perform_update(serializer)
            # MS02 - Sucesso na Edição
            return Response({
                "mensagem": "Dados do cliente atualizados com sucesso!", 
                "dados": serializer.data
            }, status=status.HTTP_200_OK)
            
        # RN03 / MS04 - Dados Inválidos
        return Response({
            "mensagem": "Erro: Informações inválidas detectadas. Por favor, corrija os campos destacados e tente novamente.",
            "detalhes": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        # RN06 - Regra de Remoção (Exclusão Lógica)
        try:
            cliente = self.get_object()
            cliente.is_active = False
            cliente.save()
            # MS03 - Sucesso na Exclusão
            return Response({"mensagem": "O cliente foi desativado com sucesso!"}, status=status.HTTP_200_OK)
        except Http404 as e:
            return Response({"erro": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            # MS06 - Falha na Exclusão
            return Response({
                "erro": "Erro: Não foi possível excluir o cliente. Tente novamente."
            }, status=status.HTTP_400_BAD_REQUEST)