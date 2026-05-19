from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.http import Http404
from .models import OrdemServico
from .serializers import OrdemServicoSerializer

class OrdemServicoViewSet(viewsets.ModelViewSet):
    queryset = OrdemServico.objects.all()
    serializer_class = OrdemServicoSerializer

    def get_object(self):
        try:
            return super().get_object()
        except Http404:
            raise Http404("Erro: A Ordem de Serviço informada não está cadastrado ou encontra-se suspenso.")
        
    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
        except Http404 as e:
            return Response({"erro": str(e)}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        if 'veiculo' not in request.data or not request.data.get('veiculo'):
            return Response(
                {"erro": "Erro: Não é possível abrir a Ordem de Serviço. É necessário selecionar um veículo válido."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({
                "erro": "Erro: Informações inválidas detectadas. Por favor, corrija os campos destacados e tente novamente.",
                "detalhes": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_create(serializer)
        
        return Response({
            "mensagem": "Ordem de Serviço aberta com sucesso!", 
            "dados": serializer.data
        }, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        
        try:
            instance = self.get_object()
        except Http404 as e:
            return Response({"erro": str(e)}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if not serializer.is_valid():
            return Response({
                "erro": "Erro: Informações inválidas detectadas. Por favor, corrija os campos destacados e tente novamente.",
                "detalhes": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_update(serializer)
        
        return Response({
            "mensagem": "Dados da Ordem de Serviço atualizados com sucesso!", 
            "dados": serializer.data
        }, status=status.HTTP_200_OK)
    
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
        except Http404 as e:
            return Response({"erro": "Erro: A Ordem de Serviço informada não existe."}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            # Em vez de deletar, nós mudamos o status para 'cancelado' e salvamos
            instance.status = 'cancelado'
            instance.save()
            
            return Response({"mensagem": "A Ordem de Serviço foi cancelada com sucesso!"}, status=status.HTTP_200_OK)
            
        except Exception:
            return Response(
                {"erro": "Erro: Não foi possível cancelar a Ordem de Serviço devido a uma instabilidade no sistema. Tente novamente."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )