Overview: this project uses the K-clustering/K-means algorithm to classify songs into different playlists, and then creates these playlists 
for a Spotify user. 

Orignally I used a box plot to determine the bounds of my song classification,but this method proved to be rather inefficient. 
So I decided to revisit this project this year and try using another classifer for two reasons. The first reason is I wanted the songs
in my playlist to be more closely related (songs of the same playlist should have the same vibe). And the second
reason is I wanted to learn more about ML classifers. 

The first classifer I looked into was a support vector machine; however, I realized I did not want to manually prep the training
data, thus I decided to turn my search to an unsupervised classifer. This way I wouldn't 
have to classify any training data, as an unsupervised ML algorithm learns without "human supervision". 
I decided on using the K clustering algorithm for of its simplicity and since it is an unsupervised ML classifer. 

I went to exportify.net and this website is able to convert a playlist into a csv file. This cvs is a list of all the songs in the playlist
along with other information about the song such as the song id, the artist, the duration, etc., and also a lot of quantiative information Spotify has on each track. 
This quantiative information included energy, danceability, loudness, tempo, etc. It was this latter information that I used to classify the songs. 

Data.csv contains all my liked songs. Cluster.py reads in this dataset edits some of the columns and runs the k-cluster algorithm
on the remaining columns. Here's my understanding of the k-cluster algorithm. As an overview it partitions a 
dataset into k distinct clusters. The first step is it (intialization step) initializes k centroids randomly, these points are vectors are in the same space as the data points.
For example, if the data set contains n dimensions, the centroids will all be vectors of n dimensions. 

We then assign each data point to the nearest centroid (compare the distance from the point to each centroid and assign it the shortest distance centroid),
This creates k clusters of data points (assignment step). We then calculate new centroids by taking the mean of all the data points assigned to each cluster (update step). 
Side note is this the most efficient way we can determine new centroids (always been skeptical of using the mean). Then we repeat these Three
steps until the centroids don't change anymore or we've reached the max number of iterations (algorithm converges). 

FAQ:
Why did we standardize the data?
As an overview we standarize as a part of pre processing data. Features with larger range can disproportionately 
influence the data (becuase we are taking distances) so we use z-scores instead (this is standardizing). 
Thus each feature holds an equal weight. Something to consider is that maybe we don't want each feature 
to hold an equal weight. Some features may be more important than others. 

Why did we use k-means++?
The orignal way K-clustering picks its centroids is completely arbitrary, but this could lead to centroids Being
too close together. Thus K-means++ selects intial centroids in a way that they are spread out - resulting in 
a lower likelihood of poor clustering. This could potentially lead to a faster convergence/better clustering quality. 

From there, first we call createPlaylists (located in request.py) and we also create an output txt file
of the playlists that will be generated (prints out the distinct clusters). The two parameters going into 
createPlaylists are n-clusters which determines the number of clusters (number of playlists) and then 
the dataset that contains which cluster each song belongs to.

The second file, request.py first obtains an authentication code using the spotify developpers website. 
After obtaining this code, we can make an API request using Spotify's APIs to our own account to first create the playlist
and then add the song from each cluster to that newly created playlist. One small thing to note is that you can only add 100 songs 
per request to a playlist, so you might have to make multiple requests depending on the number of songs you want to add. 

To run this:
Download your playlist data from exportify (you might have to edit the column names to match those in cluster.py)
Add in your spotify user id in request.py
In your terminal type: python3 cluster.py