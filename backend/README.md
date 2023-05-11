Before working in the Back-end please try the tutorial here `https://docs.djangoproject.com/en/4.1/intro/tutorial01/`

# Setting up DB

Ensure PSQL15 and psycopg are installed.

# Accessing postgres

Use command:
docker exec -t -i CONTAINERID bash

Once in the bash terminal type

psql -U postgres

# Populating the database

Run 
`cmd /c "docker exec -i <Docker container> psql -U postgres postgres < data.sql"`

from the same directory as data.sql and the db should be populated.

Access the bash terminal with 

docker exec -t -i CONTAINERID bash

Drop the table and create a new one

dropdb postgres -U postgres
createdb postgres -U postgres

Then migrate all the models/applications
python manage.py makemigrations <appname>
python manage.py migrate

To populate the database we can do it from the data.sql file.
docker exec -i CONTAINERID psql -U postgres -d postgres < backend/data.sql

# To make a new app

`python manage.py startapp <appname>`

then open the build.sh

and add `python src/manage.py makemigrations <appname>`.

such as `python src/manage.py makemigrations accounts`

python manage.py migrate


Make sure to open `settings.py` and add the app to the `INSTALLED_APPS` array in the form of `<appname>.apps.<appname>Config`

such as `'polls.apps.PollsConfig'`


Also make sure to update `urls.py` with the path to the page `path('<appname>/', include('<appname>.urls'))`

such as `path('polls/', include('polls.urls')),`

