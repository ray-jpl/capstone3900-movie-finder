from django.shortcuts import  render, redirect
from django.contrib.auth import get_user_model
from django.contrib import messages
from django.db.models import Sum
from .models import Review
from movies.models import Movie
from django.http import HttpResponse
import json
from django.views.decorators.csrf import csrf_exempt 

def index(request) -> HttpResponse:
    """Basic response on index to check if backend is connected
    
    Args:
        request: request from frontend

    Returns:
        HttpResponse(Json)

    """
    return HttpResponse(json.dumps({'response' : "reviews"}))

def get_review(request, movieId: int, reviewerId: int) -> HttpResponse:
    """Get details about reviews written under the movie by movie id
       exclude reviews written by blacklisted users
       
    Args:
        request: request from frontend
        movieId (int): The id of the movie that review is being gotten
        reviewerId (int): Id of the user to checked if logged in
    
    Returns:
        HttpResponse(Json): reponse with the requested information
    """
    if request.method == "GET":
        hasBlacklist = False
        reviewsList = []
        if reviewerId > 0:
            blacklist = get_user_model().objects.filter(id=reviewerId).values('banned')
            # if someone in blacklist
            if blacklist[0]['banned'] is not None:
                hasBlacklist = True
                tempResult = Review.objects.exclude(reviewer__in=blacklist.all()).filter(movie=movieId)
                if (tempResult.count() == 0):
                    return HttpResponse(json.dumps({'error': 'No reviews yet!'}))
                for r in tempResult:
                    profileStatus = "New Reviewer"
                    review_count = Review.objects.filter(reviewer=r.reviewer).count()
                    if (review_count < 5 and review_count > 2):
                        profileStatus = "Beginner Reviewer"
                    elif (review_count < 10 and review_count > 4):
                        profileStatus = "Intermediate Reviewer"
                    elif (review_count > 9):
                        profileStatus = "Expert Reviewer"
                    newReview = {'name': f'{r.reviewer.name}', 'reviewerId': f'{r.reviewer.id}', 'review': f'{r.review}', 'rating': f'{r.rating}', 'title': f'{profileStatus}'}

                    reviewsList.append(newReview)
                            
                return HttpResponse(json.dumps(reviewsList))
                
        # if not logged in or no blacklist
        if (hasBlacklist == False):
            result = Review.objects.filter(movie=movieId)  

        if (result.count() == 0):
            return HttpResponse(json.dumps({'error': 'No reviews yet!'}))
        for r in result:
            profileStatus = "New Reviewer"
            review_count = Review.objects.filter(reviewer=r.reviewer).count()
            if (review_count < 5 and review_count > 2):
                profileStatus = "Beginner Reviewer"
            elif (review_count < 10 and review_count > 4):
                profileStatus = "Intermediate Reviewer"
            elif (review_count > 9):
                profileStatus = "Expert Reviewer"
            newReview = {'name': f'{r.reviewer.name}', 'reviewerId': f'{r.reviewer.id}', 'review': f'{r.review}', 'rating': f'{r.rating}', 'title': f'{profileStatus}'}
            print(newReview)
            print(r.reviewer)
            reviewsList.append(newReview)
        return HttpResponse(json.dumps(reviewsList))
    

@csrf_exempt
def post_review(request) -> HttpResponse:
    """Make a review with: id, review, rating, movieId, reviewerId
    
    Args:
        request: request from frontend with all the required info
    
    Returns:
        HttpResponse(Json): response to tell frontend if sucessfully added 
    """
    if request.method == "POST":
        data = json.loads(request.body)
        movieId = Movie.objects.get(id=data.get("movieId"))
        reviewerId = get_user_model().objects.get(id=data.get("reviewerId"))
        review = data.get("review")
        rating = data.get("rating")

        Review.objects.create(reviewer=reviewerId, movie=movieId, review=review, rating=rating)
        movie_reviews = Review.objects.filter(movie=movieId)
        rating_sum = 0
        ratings = 0
        for reviews in movie_reviews:
            rating_sum += reviews.rating
            ratings += 1

        movieId.rating = rating_sum/ratings
        movieId.save()

        return HttpResponse(json.dumps({'success' : "Successfully posted review"}))

def get_rating(request, movieId: int, userId: int) -> HttpResponse:
    """Gets the rating of the Movie and takes in userid 
        to calculate the rating excluding blacklisted users
    Args:
        request: request from frontend
        movieId (int): target movie 
        userId (int): the user that is requesting the rating to check if logged in or not

    Returns:
        HttpResponse(Json): response with the rating
    """
    if request.method == "GET":
        if (userId > 0):
            blacklist = get_user_model().objects.filter(id=userId).values("banned")
            if (blacklist[0]['banned'] is not None):
                reviews = Review.objects.exclude(reviewer__in=blacklist.all()).filter(movie=movieId)
                print(reviews)
                count_ratings = int(reviews.count()) if (int(reviews.count()) > 0) else 1
                if reviews.count() == 0:
                    sum_ratings = 0
                else:
                    sum_ratings = float(reviews.aggregate(Sum('rating'))['rating__sum'])
                new_rating = sum_ratings/(count_ratings)
                return HttpResponse(json.dumps({'rating': f'{new_rating}'}))
        
        # Otherwise just retrieve the stored rating
        movie = Movie.objects.get(id=movieId)
        return HttpResponse(json.dumps({'rating': f'{movie.rating}'}))