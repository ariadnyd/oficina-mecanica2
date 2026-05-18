from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Procedimento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(error_messages={'unique': 'Já existe um procedimento cadastrado com este nome.'}, max_length=255, unique=True)),
                ('valor', models.DecimalField(decimal_places=2, max_digits=10)),
                ('tempo_medio', models.CharField(max_length=50)),
                ('descricao', models.TextField()),
                ('is_active', models.BooleanField(default=True)),
            ],
        ),
    ]
