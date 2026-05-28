from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("api/auth/", include("user.urls")),
    path("admin/", admin.site.urls),
    path('api/', include('clientes.urls')),
    path('api/', include('veiculos.urls')),
    path('api/', include('core.urls')),
    path('api/', include('ordens_servico.urls')),
]

