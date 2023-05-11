from django.http import JsonResponse
from models import Cast

# Create your views here.

def get_cast(request, movieId: int) -> JsonResponse:
    '''Get the cast of the movie
    
    Args:
        request: request from the frontend
        movieId (int): requested movie's ID
    
    Returns:
        JsonReponse: of results
    '''
    if request.method == "GET":
        print("getting cast of movie")
        cast = Cast.objects.get(id=movieId).person.select_related().all()
        result = []
        for member in cast:
            result.append(member)
        print(result)
    return JsonResponse({"result" :result})
