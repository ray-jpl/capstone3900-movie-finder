from django.http import JsonResponse, HttpResponse
from datetime import datetime

def index(request):
    return HttpResponse({"result":"ok"})
