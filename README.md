# backend

Endpoints

·Authentication
You will need to hit this endpoints to do anything in the API.

POST /api/auth/login
Takes "username" and "password" and logs in that user IF credentials are valid.
Returns an authenticated message and also a token.
example :
{
username:"admin",
password:"admin"
}

POST /api/auth/register
Takes "username" and "password" and if username is not already in the database creates a new user with those credentials.
Returns the newly created username, with the hashed password
example :
{
username:"newAccount",
password:"newAccount"
}

·favorite post

GET /api/reddit/favorite
Returns the list of songs liked by the user.

POST /api/reddit/favorite
Takes an "post_id" that is an id of a song (not post_id like it was supposed to be).
Returns the list of songs liked by the user.
example :
{
post_id:"1981" //Where 1981 is the id of the song, not the post_id
}
  
DELETE /api/reddit/favorite
Takes an "post_id" that is an id of a song (not post_id like it was supposed to be).
Returns a message displaying if the song could be deleted or not.
example :
{
post_id:"1981" //Where 1981 is the id of the song, not the post_id
}

TODO (top takes priority)

[50] Basic api setup
[75] Users table
[75] Authentication
[] Save favorited posts {standby}
[] Get predictions (stanby)
[] Web deployment

[30] Dummy test
[25] Initial mockup, waiting for implementation
[50] Most features
[75] All features implemented, debugging/polishing
[100] Ready for production
