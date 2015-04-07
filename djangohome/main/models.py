from django.db import models
from django.utils import timezone


class Highscore(models.Model):
    mode = models.CharField('mode', max_length=16, null=False)
    name = models.CharField('name', max_length=16, null=False)
    score = models.IntegerField('score', null=False, db_index=True)
    created_at = models.DateTimeField('date created', null=True)

    @classmethod
    def topn(cls):
        highscores = cls.objects.order_by('-score')[:10]
        if len(highscores) == 0:
            highscores = [
                cls(name='Anonymous', mode='normal', score=100, created_at=timezone.now())
            ]
        return highscores
