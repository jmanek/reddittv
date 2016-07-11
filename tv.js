$(function() {
	setupIframe();
	getSubreddit('videos', 'hot');
});

var setupIframe = function() {
	$('#playerIframe').attr('width', document.body.clientWidth);
	$('#playerIframe').attr('height', 0.75*(document.body.clientHeight));
}
var getSubreddit = function(subreddit, filter) {
	$.ajax({
		url: 'https://api.reddit.com/r/' + subreddit + '/' + filter,
		success: function(res) {
			displayVideos(res.data.children);
		}
	
	});
};

var setSubreddit = function(subreddit) {
	$("#dropdownButton").text(subreddit); 
	getSubreddit(subreddit, 'hot');
};
var displayVideos = function(posts) {
	//Find the videos 
	var videos = []
	for (var i = 0; i < posts.length; i++) {
		if (posts[i].data.media_embed.content) {
			videos.push({
				src: getSrc(posts[i].data.media_embed.content),
				thumbnail: posts[i].data.thumbnail,
				title: posts[i].data.title,
				permalink: posts[i].data.permalink
			});
		}
	}

	//Create carousel with videos
	createVideoGrid(videos);
};

var createVideoGrid = function(videos) {
	$('#videoCarousel').remove();
	$('#videos').append($('<div class="carousel" id="videoCarousel"></div>'))
	//Create a carousel item for each video
	for (var i = 0; i < videos.length; i++) {
		videos[i].src = 'https:' + videos[i].src.replace('https:', '').replace('http:', '')
		var item = $('<a class="carousel-item" id="' + i + 
					           '" video-data="' + videos[i].src + 
					           '" video-title="' + videos[i].title +
					           '" video-permalink="https://reddit.com' + videos[i].permalink +
					           '" href="#' + i + 
					           '"> <img src="' + videos[i].thumbnail + '"/></a>');
		$('#videoCarousel').append(item);
	}
	//Initialize the carousel
    $('.carousel').carousel({dist:0});

    window.location.hash = "#0"
    playVideo();
};

//Gets the iframe src attribute returned from reddit's api
var getSrc = function(src) {
	return src.match(/src=.[^ ]*/)[0].replace('src=', '').replace('"', '');
};

var playVideo = function() {
	var video = $(window.location.hash);
	$('#playerIframe').attr('src', video.attr('video-data'));
	$('#videoLink').attr('href', video.attr('video-permalink'));
	$('#videoTitle').text(video.attr('video-title'));
}
var addSubreddit = function() {
	var subreddit = $('#subredditInput').val();
	$('#subredditList').append($('<li><a onclick="setSubreddit("' + subreddit + '"")">' + subreddit + '</a></li>'));
	setSubreddit(subreddit);	
	$('#subredditInput').val('');

}
window.onhashchange = playVideo