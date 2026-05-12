from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Rol, Usuario
from .serializers import RolSerializer, UsuarioSerializer


class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

    def destroy(self, request, *args, **kwargs):
        rol = self.get_object()
        if rol.nombre == 'admin':
            return Response(
                {'error': 'No se puede eliminar el rol admin.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        rol.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.select_related('rol').all()
    serializer_class = UsuarioSerializer

    @action(detail=True, methods=['patch'], url_path='asignar-rol')
    def asignar_rol(self, request, pk=None):
        usuario = self.get_object()
        rol_id = request.data.get('rol_id')
        if not rol_id:
            return Response({'error': 'rol_id es requerido.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            rol = Rol.objects.get(pk=rol_id)
        except Rol.DoesNotExist:
            return Response({'error': 'Rol no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        usuario.rol = rol
        usuario.save()
        return Response(UsuarioSerializer(usuario).data)
