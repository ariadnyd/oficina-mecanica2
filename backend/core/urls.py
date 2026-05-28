from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InsumosViewSet
from .views import ProcedimentoViewSet

router = DefaultRouter()
router.register(r'insumos', InsumosViewSet, basename='insumo')
router.register(r'procedimentos', ProcedimentoViewSet, basename='procedimento')

urlpatterns = [
  path('', include(router.urls)),
]