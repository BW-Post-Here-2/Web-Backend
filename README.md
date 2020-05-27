# backend

Endpoints

<h1>·Authentication</h1>
You will need to hit this endpoints to do anything in the API.
 
<h2>POST /api/auth/login</h2>
Takes "username" and "password" and logs in that user IF credentials are valid.
Returns an authenticated message and also a token.
example :
{
username:"admin",
password:"admin"
}

<h2>POST /api/auth/register</h2>
Takes "username" and "password" and if username is not already in the database creates a new user with those credentials.
Returns the newly created username, with the hashed password
example :
{
username:"newAccount",
password:"newAccount"
}

<h2>put /api/auth/user</h2>
Takes "username" and "password" and if username is not already in the database creates a new user with those credentials. Returns a succesful message.

<h1>Favorite</h1>

<h2>GET /api/reddit/favorite</h2>
Returns the list of songs liked by the user.

<h2>POST /api/reddit/favorite</h2>
Takes an "post_id" that is an id of a song (not post_id like it was supposed to be).
Returns the list of songs liked by the user.
example :
{
post_id:"1981" //Where 1981 is the id of the song, not the post_id
}
  
<h2>DELETE /api/reddit/favorite</h2>
Takes an "post_id" that is an id of a song (not post_id like it was supposed to be).
Returns a message displaying if the song could be deleted or not.
example :
{
post_id:"1981" //Where 1981 is the id of the song, not the post_id
}

<h1>TODO (top takes priority)</h1>

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
