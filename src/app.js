new Vue({
	el: '#app',
	data: {
		searchInput: '',
		searchResults: [],
		selectedMovies: [],
		revealedCharacters: 0,
	},
	methods: {
		searchInputChagne: function() {

			var ajax = new Ajax(),
				self = this;

			if (this.searchInput.length < 5) {
				return;
			}

			ajax.get('http://www.omdbapi.com/?s=' + this.searchInput).always(function (result) {
				if (result && result.Response != "False") {
					self.searchResults = result.Search.map(function(m) {
						return {
							title: m.Title,
							year: m.Year,
							imdb: m.imdbID,
						}
					});
				}
			});
		},
		selectMovie: function(movie) {
			this.searchInput = '';
			this.searchResults = [];

			var ajax = new Ajax(),
				self = this;

			ajax.get('http://www.omdbapi.com/?i=' + movie.imdb).done(function(result) {
				self.selectedMovies.push({
					title: result.Title,
					year: result.Year,
					imdb: result.imdbID,
					actors: result.Actors.split(', '),
				});
			});
		},
		deselectMovie: function(movie) {
			this.selectedMovies.some(function(e, i, a){
				if (e.title == movie.title) {
					a.splice(i, 1);
				}
			})
		},
		showCharacter: function() {
			this.revealedCharacters ++;
		},
	},
	computed: {
		matches: function() {
			var allActors = {},
				result = [];
			this.selectedMovies.forEach(function (m) {
				m.actors.forEach(function(a) {
					if (a in allActors) {
						allActors[a] ++;
					} else {
						allActors[a] = 1;
					}
				});
			});
			for (var s in allActors) {
				if (allActors.hasOwnProperty(s) && allActors[s] == this.selectedMovies.length) {
					result.push(s);
				}
			}
			return result;
		},
		revealedName: function() {
			if (this.matches.length != 1) {
				return false;
			}
			return this.matches[0].substring(0, this.revealedCharacters);
		},
	}
});




