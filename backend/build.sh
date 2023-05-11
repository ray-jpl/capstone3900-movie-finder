#!/bin/dash

echo 'Running migrations on database...'

# keep adding when new apps are added

python manage.py makemigrations 

python manage.py migrate 
