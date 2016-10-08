$(function() {
	setupIframe();
	buildSubredditList();
	setSubreddit(getCurrentSubreddit(), false);
	// window.onhashchange = playVideo

	$('#skipNextArrow').mouseup(function() {
		setVideo((parseInt(getCurrentVideoID()) + 1).toString());
		$('.carousel').carousel('next');
	});

	$('#skipPrevArrow').mouseup(function() {
		setVideo((parseInt(getCurrentVideoID()) - 1).toString());
		$('.carousel').carousel('prev');
	});
	$('body').keypress( function(e) {
		if (e.which == 99 || e.which == 67) {
			console.log(e.which);
			$('#videoTitle').click();
		}
	});
	// var iframe = document.getElementById('playerIframe').onload = function() {

	// }

// function iframeReady() {
//   console.log('iframe is ready');
//   // iframe.contentDocument.removeEventListener('DOMContentLoaded', iframeReady);
//   // iframe.contentWindow.removeEventListener('load', iframeReady);
// }

// function checkForIframeReady() {
//   iframe.contentDocument.addEventListener('DOMContentLoaded', iframeReady);
//   iframe.contentWindow.addEventListener('load', iframeReady);
//   if (iframe.contentDocument.readyState === "interactive" || iframe.contentDocument.readyState === "complete") {
//     iframeReady();
//   }
// }
// checkForIframeReady();
});

var buildSubredditList = function() {
	var defaultSubreddits = ['rage', 'justiceserved', 'cringe', 'amifreetogo', 'curiousvideos', 'politicalvideo', 'artisanvideos', 'documentaries'];
	for (var i = 0; i < defaultSubreddits.length; i++) {
		$('#subredditList').append($('<li><a onclick="setSubreddit(&#39' + defaultSubreddits[i] + '&#39, true)">' + defaultSubreddits[i] + '</a></li>'));
	}
};

var setSubreddit = function(subreddit, resetVideoID) {
	$("#dropdownButton").text(subreddit); 
	var videoID = resetVideoID ? '0' : getCurrentVideoID();
	window.location.hash = '#videoID=' + videoID + '&subreddit=' + subreddit;

	$.ajax({
		url: 'https://api.reddit.com/r/' + subreddit + '/' + 'hot',
		success: function(res) {
			displayVideos(res.data.children);
		}
	
	});
};

var setVideo = function(video) {
	// $('.carousel').carousel('set', parseInt(video));
	if (parseInt(video) < 0) video = '0';
	window.location.hash = '#videoID=' + video + '&subreddit=' + getCurrentSubreddit();
	playVideo();
}

var playVideo = function() {
	var video = $('#' + getCurrentVideoID());
	$('#playerIframe').attr('src', video.attr('video-data'));
	$('#videoLink').attr('href', video.attr('video-permalink'));
	$('#videoTitle').text(video.attr('video-title'));
}

var getCurrentSubreddit = function() {
	if (window.location.hash.indexOf('subreddit') < 0 ) return 'videos';
	return window.location.hash.replace(/#videoID=[0-9]*&subreddit=/, '');
}

var getCurrentVideoID = function() {
	videoID = window.location.hash.replace(/#videoID=/, '').replace(/&subreddit=.*/, '');
	if (videoID == '') return '0';
	return videoID;
}

var addSubreddit = function() {
	var subreddit = $('#subredditInput').val();
	$('#subredditList').append($('<li><a onclick="setSubreddit(' + subreddit + ', true)">' + subreddit + '</a></li>'));
	setSubreddit(subreddit);	
	$('#subredditInput').val('');

}



var setupIframe = function() {
	$('#playerIframe').attr('width', document.body.clientWidth);
	$('#playerIframe').attr('height', 0.75*(document.body.clientHeight));
}




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
		videos[i].src = 'https:' + videos[i].src.replace('https', '').replace('http', '').replace(':', '').replace('"', '').trim() + '&autoplay=1&disablekb=1';
		console.log(videos[i].src);
		var item = $('<a class="carousel-item" id="' + i + 
					           '" video-data="' + videos[i].src + 
					           '" video-title="' + videos[i].title +
					           '" video-permalink="https://reddit.com' + videos[i].permalink +
					           '" onclick="setVideo(' + i + ')' +  
					           // '" href="#' + i + 
					           '"> <img src="' + videos[i].thumbnail + '"/></a>');
		$('#videoCarousel').append(item);
	}
	//Initialize the carousel
    $('.carousel').carousel({dist:0});
    setVideo(getCurrentVideoID());

};

//Gets the iframe src attribute returned from reddit's api
var getSrc = function(src) {
	return src.match(/src=.[^ ]*/)[0].replace('src=', '').replace('"', '');
};


