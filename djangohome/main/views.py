from django.shortcuts import render_to_response
from django.template import RequestContext


def game(request):
    return render_to_response(
        'main/game.html',
        {},
        context_instance=RequestContext(request)
    )
