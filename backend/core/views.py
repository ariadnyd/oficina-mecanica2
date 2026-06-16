from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.authentication import SessionAuthentication
from .models import Insumos, Procedimento
from .serializers import InsumosSerializer, ProcedimentoSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication

# Regra personalizada: Funcionários apenas leem e criam. Admins fazem tudo.
class IsAdminOrReadOnlyCreate(BasePermission):
    def has_permission(self, request, view):
        # Se não estiver logado, não acessa nada
        if not request.user.is_authenticated:
            return False
        
        # Admin pode fazer qualquer coisa (GET, POST, PUT, DELETE)
        if request.user.is_staff:
            return True
        
        # Funcionário (não-staff) só pode ver (GET) ou criar (POST)
        if request.method in ['GET', 'POST']:
            return True
            
        return False

class InsumosViewSet(viewsets.ModelViewSet):
    queryset = Insumos.objects.filter(is_active=True)
    serializer_class = InsumosSerializer
    permission_classes = [IsAuthenticated] 

    def destroy(self, request, *args, **kwargs):
        insumo = self.get_object()
        insumo.is_active = False
        insumo.save()
        return Response(
            {"detail": "O insumo foi desativado com sucesso!"},
            status=status.HTTP_204_NO_CONTENT
        )

class ProcedimentoViewSet(viewsets.ModelViewSet):
    queryset = Procedimento.objects.filter(is_active=True)
    serializer_class = ProcedimentoSerializer
    # Agora usamos nossa regra personalizada
    permission_classes = [IsAdminOrReadOnlyCreate]
    authentication_classes = [JWTAuthentication]

    def destroy(self, request, *args, **kwargs):
        # Só o Admin chega aqui, pois a permissão bloqueia o DELETE para funcionários
        procedimento = self.get_object() 
        procedimento.is_active = False
        procedimento.save()
        return Response(
            {"detail": "O procedimento foi desativado com sucesso!"},
            status=status.HTTP_204_NO_CONTENT
        )