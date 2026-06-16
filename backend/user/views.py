from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserSerializer

# Sua classe de permissão personalizada
class IsAdminUser(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.is_staff

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    # Trocamos o AllowAny por IsAdminUser. Só o ADM cadastra gente nova!
    permission_classes = (IsAdminUser,)

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
  
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """
        Regra de segurança: 
        - Se for admin (staff), pode acessar/editar qualquer usuário.
        - Se for usuário comum, a query retorna apenas o próprio perfil.
        """
        user = self.request.user
        if user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=user.id)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object() 
        usuario_logado = request.user 

        if 'is_staff' in request.data:
            novo_is_staff = request.data['is_staff']

            if instance.is_staff and not novo_is_staff:
                
                # TRAVA 1: O Admin não pode rebaixar a si mesmo
                if usuario_logado.id == instance.id:
                    return Response(
                        {"detail": "⚠️ Segurança: Você não pode remover seus próprios privilégios de Administrador!"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # TRAVA 2: Não pode remover se ele for o ÚNICO admin do sistema
                total_admins = User.objects.filter(is_staff=True).count()
                if total_admins <= 1:
                    return Response(
                        {"detail": "⚠️ Segurança: Este é o único Administrador do sistema. Promova outro usuário antes de rebaixar este!"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

        return super().update(request, *args, **kwargs)

class UserListView(generics.ListAPIView):
    """
    View para o Admin listar todos os usuários cadastrados.
    """
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = (IsAdminUser,) 