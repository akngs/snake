# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Highscore',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('rank', models.IntegerField(verbose_name=b'rank')),
                ('mode', models.CharField(max_length=16, verbose_name=b'mode')),
                ('name', models.CharField(max_length=16, verbose_name=b'name')),
                ('score', models.IntegerField(verbose_name=b'score')),
                ('created_at', models.DateTimeField(null=True, verbose_name=b'date created')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='highscore',
            unique_together=set([('rank', 'mode')]),
        ),
    ]
