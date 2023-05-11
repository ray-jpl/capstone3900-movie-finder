from django.http import HttpResponse, JsonResponse
from .models import Genre, Movie, Forum
from cast.models import Cast, People
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
import random

def index(request) -> HttpResponse:
    """Prints returns the tables in the db to ensure connection is valid
    
    Args:
        request: request from frontend
    
    Returns:
        HttpResponse: response of the table information
    """
    result = "success"
    print("data responded via HTTP")
    return HttpResponse(result)

def get_movies(request) -> HttpResponse:
    """Get top 25 movies by rating
    
    Args:
        request: request from frontend

    Returns:
        HttpResponse: list of top 25 movies by rating
    """
    if request.method == "GET":
        movieList = []
        top_movies = Movie.objects.order_by('-rating')[:25]

        for movie in top_movies:
            newMovie = {'id': f'{movie.id}', 'title': f'{movie.title}', 'rating': f'{movie.rating}', 'thumbnail':f'{movie.image}'}
            movieList.append(newMovie)
        return HttpResponse(json.dumps(movieList))
	
def top_director(request, directorId: int) -> JsonResponse:
    '''Get top movies by director
    
    Args:
        request: request from frontend
        directorId (int): target director
    
    Returns:
        JsonResponse: movies and directorId

    '''
    movies = []
    if request.method == "GET":
        for principal in Cast.objects.filter(person=directorId).filter(job='director'):
            curr = {}
            curr['id'] = principal.movie.id
            curr['title'] = principal.movie.title
            curr['rating'] = principal.movie.rating
            curr['image'] = principal.movie.image
            movies.append(curr)
    return JsonResponse({'result' : movies, 'director' : People.objects.get(id=directorId).name})

    #return list of dictionaries with id, rating, title and image

def top_writer(request, writerId: int) -> JsonResponse:
    """get top movies by writer
    
    Args:
        request: request from frontend
        writerId (int): target writer to get movies from
    
    Returns:
        JsonReponse: movies and associated writer
    """
    movies = []
    if request.method == "GET":
        for principal in Cast.objects.filter(person=writerId).filter(job='writer'):
            curr = {}
            curr['id'] = principal.movie.id
            curr['title'] = principal.movie.title
            curr['rating'] = principal.movie.rating
            curr['image'] = principal.movie.image
            movies.append(curr)
    return JsonResponse({'result' : movies, 'writer' : People.objects.get(id=writerId).name})

def top_cast(request, castId: int) -> JsonResponse:
    """get top movies by actor/cast member
    
    Args: 
        request: request from frontend
        castId (int): target cast member to get movies by
    
    Returns:
        JsonResponse: movies and cast ID
    """
    movies = []
    if request.method == "GET":
        for principal in Cast.objects.filter(person=castId):
            curr = {}
            curr['id'] = principal.movie.id
            curr['title'] = principal.movie.title
            curr['rating'] = principal.movie.rating
            curr['image'] = principal.movie.image
            movies.append(curr)
    return JsonResponse({'result' : movies, 'cast' : People.objects.get(id=castId).name})

def top_genre(request, genreName: str) -> JsonResponse:
    """get top movies by genre
    
    Args:
        request: request from frontend
        genreName (str): name of the genre that is being searched

    Returns:
        JsonReponse: list of movies and their details
    """
    movies_list = []
    if request.method == "GET":
        for movies in Genre.objects.filter(genre=genreName):
            curr = {}
            curr['id'] = movies.movie.id
            curr['title'] = movies.movie.title
            curr['rating'] = movies.movie.rating
            curr['image'] = movies.movie.image
            movies_list.append(curr)
    return JsonResponse({'result' : movies_list})

def get_details(request, movieId: int) -> HttpResponse:
    """Get details of the requsted movie from the DB
    
    Args:
        request: request from frontend
        movieId (int): target movie to get details from
    
    Returns:
        HttpResponse: details of the requested movie    
    """
    if request.method == "GET":
        mov = Movie.objects.get(id=movieId)
        if (mov == None):
            return HttpResponse(json.dumps({'error': 'Movie not found'}))

        genreList = []
        genres = Genre.objects.filter(movie=mov)
        for genre in genres:
            genreList.append(genre.genre)

        cast_job = ['cast', 'actor', 'actress']
        castResult = Cast.objects.filter(movie=movieId)
        directorId = 0
        director = ''
        writerList = []
        castList = []
        for member in castResult:
            if (member.job in cast_job):
                castList.append((member.person.name, member.person.id))
            elif (member.job == 'writer'):
                writerList.append((member.person.name, member.person.id))
            elif (member.job == 'director'):
                director = member.person.name
                directorId = member.person.id

        newMovie = {'id': f'{mov.id}', 
                    'title': f'{mov.title}', 
                    'description': f'{mov.description}', 
                    'year': f'{mov.year}', 
                    'runtime': f'{mov.runtime}', 
                    'rating': f'{mov.rating}',  
                    'image': f'{mov.image}', 
                    'director': director, 
                    'directorId': directorId,
                    'writerList': writerList, 
                    'castList': castList, 
                    'genreList': genreList }
        return HttpResponse(json.dumps(newMovie))
				
def get_recommendations(request, movieId: int) -> JsonResponse:
    '''recommend 10 movies based on genre and directors
    
    Args: 
        request: request from frontend
        movieId (int): related movie that needs recommendations
    
    Returns:
        JsonReponse: related movies
    '''
    if request.method == "GET":
        director_movies = get_movies_director(get_directors(movieId))
        genre_movies = get_movies_genres(get_genres(movieId))
        movies = director_movies + list(set(genre_movies) - set(director_movies))
        random.shuffle(movies)
        result = []
        print(movies)
        for movie in movies:
            if movie.id != movieId:
                result.append(movie.id)
			
        return JsonResponse({"result": result})
    return JsonResponse({"result": "error"})

def search(request, query: str):
    '''returns a queryset of movies that apply to the search term
    
    Args: 
        request: request from frontend
        query (str): string that is being matched
    
    Returns:
        JsonReponse: of related movies to the search by descriptor
    '''
    if request.method == "GET":
        search_movies = {}
        # dictionary of lists of dictionaries {"by_genre" : [{"genre": "action", "movies":[movies]}], "by_title" : [{"title" : "title", "movies": [details]} ]}

        genres = Genre.objects.filter(genre__icontains=query).order_by('-movie__rating')
        # Get genres
        by_genre = {}

        # list of dictionaries [{"genre":[movies], "genre2":[movies]}]
        for movie_genre in genres:
            temp = {"movies": [], "genre": movie_genre.genre}
            details = {}
            if movie_genre.genre not in by_genre:
                by_genre[movie_genre.genre] = temp
                # make an entry in the dictionary   
            details["id"] = movie_genre.movie.id
            details["title"] = movie_genre.movie.title
            details["year"] = movie_genre.movie.year
            details["image"] = movie_genre.movie.image
            details["rating"] = movie_genre.movie.rating
            genres_list = []
            for g in Genre.objects.filter(movie=movie_genre.movie.id):
                genres_list.append(g.genre)
            details['genres'] = genres_list
            by_genre[movie_genre.genre]['movies'].append(details)

        search_movies["genre"] = [by_genre]


        movies = Movie.objects.filter(title__istartswith=query).order_by('-rating')
        by_title = []

        for movie in movies:
            temp = {}
            if movie.title not in by_title:
                temp["id"] = movie.id
                temp["title"] = movie.title
                temp["year"] = movie.year
                temp["image"] = movie.image
                temp["rating"] = movie.rating
                genres_list = []
                for g in Genre.objects.filter(movie=movie.id):
                    genres_list.append(g.genre)
                temp['genres'] = genres_list
                by_title.append(temp)
                
        search_movies["title"] = by_title

        # Get movies related to description
        by_description = Movie.objects.filter(description__icontains=query).order_by('-rating')
        description = []

        for movie in by_description:
            details = {}
            if movie.id not in description:
                details["id"] = movie.id
                details["title"] = movie.title
                details["year"] = movie.year
                details["image"] = movie.image
                details["rating"] = movie.rating
                genres_list = []
                for g in Genre.objects.filter(movie=movie.id):
                    genres_list.append(g.genre)
                details['genres'] = genres_list
                description.append(details)

        search_movies["description"] = description
        return JsonResponse({"result": search_movies})
    return JsonResponse({"result": "error"})

def get_genres(movieId: int) -> list:
    '''Get the genres of the Movie that is geting recommendations
    
    Args:
        movieId (int): target movie
    
    Returns:
        genres (list): list of genres related to the movie
    '''
    genres = []
    for movies in Genre.objects.filter(movie=movieId):
        genres.append(movies.genre)
    print(genres)
    return genres

def get_directors(movieId: int):
    """Get first director related to movie
    
    Args:
        movieId (int): target movie
    Returns: 
        person: first director of movie
    
    """
    print("director: " + Cast.objects.filter(movie=movieId).filter(job='director')[0].person.name)
    return Cast.objects.filter(movie=movieId).filter(job='director')[0].person


def get_movies_genres(genres: list) -> list:
    '''takes in list of genres and returns related movies in list
    
    Args:
        genres (list): list of genres
    Returns:
        movies (list): list of movies related to genres
    '''
    movies = []
    for movie_genre in genres:
        for movie in Genre.objects.filter(genre=movie_genre):
            movies.append(movie.movie)
    return movies

def get_movies_director(director) -> list:
    """Get movies by director
    
    Args:
        director (Person): director who is being searched
        
    Returns:
        movies (list): list of movies directed by target director
    """
    movies = []
    for movie in Cast.objects.filter(person=director).filter(job='director'):
        movies.append(movie.movie)
    return movies

def get_forum(request, movieId: int, reviewerId: int) -> HttpResponse:
    """Get forum for movie and takes in the Id of the 
    user to see if any posts need to be blacklisted
    
    Args:
        request: request from frontend
        movieId (int): target movie from which forum posts are being got
        reviewerId (int): id of user who is requesting the forum posts
    
    Returns:
        HttpReponse: list of the forum posts of related movie
    
    """
    if request.method == "GET":
        blackList = get_user_model().objects.filter(id=reviewerId).values("banned")
        print(blackList)
        if blackList[0]['banned'] is None:
            # if no banned then just get all
            forum_posts = Forum.objects.filter(movie=movieId).order_by('-timestamp')
            print("blacklist")
        else:
            # if there is banned then exclude the banned then filter the movie's reviews
            forum_posts = Forum.objects.exclude(reviewer__in=blackList.all()).filter(movie=movieId).order_by('-timestamp')
            print("no blacklist")
        print(forum_posts)
        discussionList = []
        if (forum_posts.count() == 0):
            return HttpResponse(json.dumps({'error': 'No discussion yet!'}))
        for message in forum_posts:
            newMessage = {'postId': f'{message.id}',  'timestamp': f'{message.timestamp}', 'movieId': f'{message.movie.id}', 'name': f'{message.reviewer.name}', 'message': f'{message.message}', 'userId': f'{message.reviewer.id}'}
            discussionList.append(newMessage)
        return HttpResponse(json.dumps(discussionList))
    return HttpResponse({"result": "error", "error": "userId is invalid"})

@csrf_exempt
def post_forum(request, movieId):
    """Request to backend and changes function depending on request method

    Args:
        request: request from frontend
        movieId: Id of the movie who's forum is being posted

    Returns:
        HttpResponse: result of posting    
    """
    if request.method == "POST":
        data = json.loads(request.body)
        print(data)
        reviewerId = data.get("reviewerId")
        message = data.get("message")
        Forum.objects.create(message=message, movie_id=movieId, reviewer_id=reviewerId)
        return HttpResponse(json.dumps({'success':  "Successfully posted message"}))
    if request.method == "PUT":
        data = json.loads(request.body)
        print(data)
        message = data.get("message")
        postId = data.get("postId")
        Forum.objects.filter(id = postId).update(message=message)
        return HttpResponse(json.dumps({'success': "Successfully updated message"}))
    if request.method == "DELETE":
        data = json.loads(request.body)
        postId = data.get("postId")
        Forum.objects.filter(id = postId).delete()
        return HttpResponse(json.dumps({'success': "Successfully deleted message"}))
    return HttpResponse({"result": "error", "error": "userId is invalid"})
