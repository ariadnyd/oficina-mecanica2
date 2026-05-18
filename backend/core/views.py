from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Insumos
from .serializers import InsumosSerializer
from rest_framework.authentication import SessionAuthentication
from .models import Procedimento
from .serializers import ProcedimentoSerializer


# Create your views here.
class InsumosViewSet(viewsets.ModelViewSet):
  queryset = Insumos.objects.all()
  serializer_class = InsumosSerializer
  permission_classes = (IsAuthenticated,)

class ProcedimentoViewSet(viewsets.ModelViewSet):
    queryset = Procedimento.objects.filter(is_active=True)
    serializer_class = ProcedimentoSerializer
    permission_classes = [IsAdminUser]

    authentication_classes = [SessionAuthentication]

    def destroy(self, request, *args, **kwargs):
        procedimento = self.get_object() 
        
        procedimento.is_active = False
        procedimento.save()

        return Response(
            {"detail": "O procedimento foi desativado com sucesso!"},
            status=status.HTTP_204_NO_CONTENT
        )