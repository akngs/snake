from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse
from django.views.generic import View
from django.utils import timezone
from datetime import timedelta
import json
import models


def game(request):
    highscores = models.Highscore.top5()
    return render_to_response(
        'main/game.html',
        {
            'highest': highscores[0],
            'highscores': highscores,
        },
        context_instance=RequestContext(request)
    )


class HighscoreView(View):
    def get(self, request):
        highscores = []
        for s in models.Highscore.top5():
            highscores.append({'name': s.name, 'score': s.score})
        return HttpResponse(json.dumps(highscores), content_type='text/json')

    def post(self, request):
        name = request.POST.get('name', 'Anonymous')
        mode = request.POST.get('mode', 'normal')
        score = int(request.POST.get('score', '0'))
        highscore = models.Highscore(name=name, mode=mode, score=score, created_at=timezone.now())
        highscore.save()

        models.Highscore.objects.filter(created_at__lte=timezone.now()-timedelta(days=3)).delete()
        return self.get(request)
