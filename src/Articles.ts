import Article from './Article';

interface IArticles {
	counts: ICount;
	lastSeen: ISeen;
	articles: Array<Article>;
}

interface ICount {
	theonion: number;
	nottheonion: number;
	[key: string]: number;
}

interface ISeen {
	theonion: string;
	nottheonion: string;
	date: string;
	[key: string]: string;
}

export default class Articles implements IArticles {
	counts: ICount;
	lastSeen: ISeen;
	articles: Array<Article>;

	constructor() {
		this.counts = { theonion: 0, nottheonion: 0 };

		// Get seen posts from localStorage
		let today     = new Date().toISOString().substring(0,10);
		this.lastSeen = { date: today, theonion: '', nottheonion: '' };

		let seen = localStorage.getItem('lastSeenPosts');
		if (seen != null) {
			let parsed = JSON.parse(seen);
			if (this.lastSeen.date < today) {
				this.lastSeen = parsed;
			}
		}

		this.articles = [];
	}

	async init() {
		await this.fetchArticles('theonion');
		await this.fetchArticles('nottheonion');
		this.shuffle();
	}

	// Gets a random article
	getArticle() {
		let needsShuffle: boolean = false;

		// Check if we need to refill our list of articles
		Object.keys(this.counts).forEach(async subreddit => {
			if (this.counts[subreddit] <= 5) {
				needsShuffle = true;
				await this.fetchArticles(subreddit);
			}
		});

		// Reshuffle if we've added to our list
		if (needsShuffle) {
			// TODO: Should find a better way to store seen posts
			// The current method can at worst hide 19 posts since you could answer the last post first
			// then leave the page, the next page load will fetch posts after that last post
			localStorage.setItem('lastSeenPosts', JSON.stringify(this.lastSeen));
			this.shuffle();
		}

		// Our list is shuffled so we can just return the last item
		let article = this.articles.pop()!;
		this.counts[article.type]--;
		return article;
	}

	// Fetches a bunch of posts from /r/theonion and /r/nottheonion
	async fetchArticles(subreddit: string) {
		const limit: number = 10
		let url: string = `/reddit/${subreddit}?limit=${limit}`;

		// Get posts after the last one we got back
		if (this.lastSeen[subreddit]) url = `${url};after=${this.lastSeen[subreddit]}`;

		// If we're on localhost then send our request to the live site
		if (window.location.hostname === 'localhost') {
			url = `https://onionornot.app${url}`;
		}

		try {
			let response = await fetch(url);
			let json = await response.json();

			json.data.children.forEach((child: any) => {
				let article = new Article(subreddit, child.data.title, child.data.url, child.data.domain);
				this.articles.push(article);

				this.lastSeen[subreddit] = child.data.name;
				this.counts[subreddit]++;
			});
		} catch (err) {
			console.log(`[ERR] Failed to fetch reddit posts from ${url}: ${err}`);
		}
	}

	shuffle() {
		// Fisher-Yates shuffle
		for (let i: number = 0; i < this.articles.length; i++) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.articles[i], this.articles[j]] = [this.articles[j], this.articles[i]];
		}
	}
}
