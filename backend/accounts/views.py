from django.contrib.auth import authenticate, login, logout, get_user_model
from django.core import serializers
from django.http import HttpResponse, JsonResponse
from .forms import NewUserForm, LoginForm
import json
from movies.models import Movie
from reviews.models import Review
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def register_post(request) -> JsonResponse:
    """Registers the user
    
    Args:
        request: request from frontend
    Returns:
        JsonResponse: details of the registration
    """
    print("Registering user")
    form = NewUserForm()
    response = {}
    if request.method == "POST":
        form = NewUserForm(request.POST)
        print("form created")
        if form.is_valid():
            print("form is valid")
            form.save()
            user = authenticate(
                email=form.cleaned_data["email"], 
                password=form.cleaned_data["password1"]
            )
            print("User exists")
            login(request, user)
            print("logging in user")
            request.session['name'] = form.cleaned_data['email']
            response['result'] = "Success"
            response['user_id'] = user.id
            return JsonResponse(response)
        response['result'] = "error"
        response["error"] = "Invalid email or email is already in use"
        return JsonResponse(response)
    
    response['result'] = "error"
    response["error"] = "Request method not POST"
    return JsonResponse(response)

@csrf_exempt
def login_post(request):
    """Logs the user in

    Args:
        request: request from frontend

    Returns: 
        JsonResponse: response to the frontend of details of login
    """
    print("Trying to log in . . . .")
    form = LoginForm()
    response = {}
    if request.method == "POST":
        form = LoginForm(request.POST)
        print("form created")
        if form.is_valid():
            print("form is valid")
            user = authenticate(
                email=form.cleaned_data['email'],
                password=form.cleaned_data['password']
            )
            if user is not None:
                print("User exists")
                login(request, user)
                print("Login success")
                request.session['name'] = form.cleaned_data['email']
                response = {"result": "Success", "session_key": request.session['name'], "user_id": user.id} #temp
                return JsonResponse(response)
            else:
                response = {"result": "Fail", "error": "Invalid email or password"}
                return JsonResponse(response)
        else:
            print("Form not valid")
            response["result"] = "Fail"
            response["error"] = "Invalid email or password"
            return JsonResponse(response)
    form = LoginForm()
    print("Request not Post")
    response["result"] = "Fail"
    response["error"] = "Request not POST"
    return JsonResponse(response)

@csrf_exempt
def user_logout(request) -> JsonResponse:
    """Logs user out
    
    Args:
        request: request from frontend
        
    Returns: 
        JsonReponse: result of logging out
    """
    print("Requested...")
    logout(request)
    print("Logging out")
    response = {"result": "Success"}
    return JsonResponse(response)

def profile(request, userId: int) -> JsonResponse:
    """Gets the profile of the user

    Args:
        request: request from frontend
        userId (int): requested user's profile
    
    Returns:
        JsonReponse: details of the user
    """
    if request.method == "GET":
        print("getting user profile...")
        result = {}
        target_user = get_user_model().objects.filter(id=userId)
        result_string = serializers.serialize('json', target_user.all())
        result_obj = json.loads(result_string)
        for field in result_obj[0]["fields"].keys():
            if field not in ("password", "last_login"):
                result[field] = result_obj[0]["fields"][field]
        return JsonResponse({'result': "Got user info successfully", "info" : result})

def user_session(request) -> JsonResponse:
    """Check if the user is authenticated
    
    Args: 
        request: frontend request
    Returns:
        JsonResponse: response of checking the user session
    """
    if request.user.is_authenticated:
        #return json with session
        print("logged in")
        response = {"result": "Success", "logged_in": "True"}
        return JsonResponse(response)
    print("not logged in")
    return JsonResponse({"result": "fail", "error": "not logged in"})
   
@csrf_exempt
def watchlist(request, userId: int) -> JsonResponse:
    """Watchlist functions depending on the request
    Get returns a list of the watchlist related to the user
    Post adds a movie to the watchlist of the related user
    Delete removes a movie from the watch list of the user
    
    Args:
        request: request from frontend
        userId (int): the user who is requesting
        
    Returns:
        JsonReponse: details of the Get/Post/Delete
    """
    target_user = get_user_model().objects.get(id=userId)

    if request.method == "GET":
        # Get the watchlist of the user
        print("getting watchlist...")
        result = []
        result_string = serializers.serialize('json', target_user.watchlist.all())
        result_obj = json.loads(result_string)
        for movie_obj in result_obj:
            dict_to_add = movie_obj["fields"]
            dict_to_add["id"] = movie_obj["pk"]
            result.append(dict_to_add)
        result = sorted(result, key=lambda x: x['rating'], reverse=True)

    if request.method == "POST":
        # Adds to the watchlist
        json_data = json.loads(request.body)
        movie = json_data["movie"]
        print("adding to watchlist...")
        try:
            result = target_user.watchlist.add(Movie.objects.get(id=movie))
            return JsonResponse({"result": "Successfully added movie to wishlist"})
        except Exception as e:
            return JsonResponse(e)

    if request.method == "DELETE":
        # Removies movie from watchlist
        json_data = json.loads(request.body)
        movie = json_data["movie"]
        print("removing from watchlist...")
        try:
            result = target_user.watchlist.remove(Movie.objects.get(id=movie))
            return JsonResponse({"result": "Successfully removed movie to wishlist"})
        except Exception as e:
            return JsonResponse(e)

    return JsonResponse({"result": result})

def watchlist_ids_only(request, userId: int) -> JsonResponse:
    """gets list of watchlist movies with only id
    
    Args:
        request: request from frontend
        userId (int): Id of person requesting watchlist
    
    Returns:
        JsonResponse: details of the watchlist
    """
    target_user = get_user_model().objects.get(id=userId)
    if request.method == "GET":
        print("getting watchlist movie ids...")
        # print(f"target_user.watchlist.all.fields: {target_user.watchlist.all()}")
        result = []
        for movie in target_user.watchlist.all():
            result.append(int(movie.id))
        # print(result)
    return JsonResponse({"result": result})

def get_blacklist(request, userId: int) -> JsonResponse:
    """Get the blacklist of a user
    
    Args:
        request: request from frontend
        userId (int): user who's blacklist is being requested
        
    Returns:
        JsonResponse: list of blacklist items
    """
    # getting black list
    if request.method == "GET":
        targetUser = get_user_model().objects.get(id=userId)
        print("=== Get blacklists ===")
        result = []
        for user in targetUser.banned.all():
            userInfo = {'id': f'{user.id}', 'name': f'{user.name}', 'email': f'{user.email}'}
            result.append(userInfo)
        return JsonResponse({"result": result})

@csrf_exempt
def blacklist(request) -> JsonResponse:
    """Blacklist functions depending on request method
    
    Args:
        request: request from frontend with a body
    
    Returns: 
        JsonResponse: details of the post/delete request
    """
    # adding to black list
    if request.method == "POST":
        payload = json.loads(request.body)
        userId = payload['userId']
        banId = payload['banId']
        targetUser = get_user_model().objects.get(id=userId)
        bannedUser = get_user_model().objects.get(id=banId)
        print("=== Adding blacklist... ===")
        try:
            result = targetUser.banned.add(bannedUser)
            return JsonResponse ({"result":"Successfully blacklisted user"})
        except Exception as e:
            return JsonResponse({'result':'fail','error':e})

    # removing from black list
    if request.method == "DELETE":
        """Removes from blacklist"""
        payload = json.loads(request.body)
        userId = payload['userId']
        banId = payload['banId']
        targetUser = get_user_model().objects.get(id=userId)
        bannedUser = get_user_model().objects.get(id=banId)
        print("=== Removing from blacklist.. ===")
        try:
            targetUser.banned.remove(bannedUser)
            return JsonResponse({"result": "Successfully removed user from blacklist"})
        except Exception as e:
            return JsonResponse({"result": "error", "error": e})

    return JsonResponse(json.dumps(result))

def profileTitle(request, userId):
    if request.method == "GET":
        review_count = Review.objects.filter(reviewer=userId).count()

        profileStatus = "New Reviewer"
        if (review_count < 5 and review_count > 2):
            profileStatus = "Beginner Reviewer"
        elif (review_count < 10 and review_count > 4):
            profileStatus = "Intermediate Reviewer"
        elif (review_count > 9):
            profileStatus = "Expert Reviewer"
        status = {'title': profileStatus, 'numMovies': review_count}
        return HttpResponse(json.dumps(status))
        