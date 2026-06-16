from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, LogoutView, UserDetailView, UserListView

urlpatterns = [
  path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
  path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
  path('register/', RegisterView.as_view(), name='register'),

  path('logout/', LogoutView.as_view(), name='logout'),
  path('users/<int:pk>/', UserDetailView.as_view(), name='user_detail'),
  path('users/', UserListView.as_view(), name='auth_user_list')
]