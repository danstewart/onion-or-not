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
	[key: string]: string;
}

export default class Articles implements IArticles {
	counts: ICount;
	lastSeen: ISeen;
	articles: Array<Article>;

	constructor() {
		this.counts = { theonion: 0, nottheonion: 0 };
		this.lastSeen = { theonion: '', nottheonion: '' };
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

		// Check if we 		// this.article = new Article('theonion', 'Headline', '');need to refill our list of articles
		Object.keys(this.counts).forEach(async subreddit => {
			if (this.counts[subreddit] <= 5) {
				await this.fetchArticles(subreddit);
				needsShuffle = true;
			}
		});

		// Reshuffle if we've added to our list
		if (needsShuffle) this.shuffle();

		// Our list is shuffled so we can just return the last item
		let article = this.articles.pop()!;
		this.counts[article.type]--;
		return article;
	}

	// Fetches a bunch of posts from /r/theonion and /r/nottheonion
	async fetchArticles(subreddit: string) {
		let limit: number = 10;

		try {
			let url: string = `https://api.reddit.com/r/${subreddit}/hot.json?limit=${limit}`;

			// Get posts after the last one we got back
			if (this.lastSeen[subreddit]) {
				url = `${url};after=${this.lastSeen[subreddit]}`;
			}

			let response = await fetch(url);
			let json = await response.json();

			json.data.children.forEach((child: any) => {
				let article = new Article(subreddit, child.data.title, child.data.url);
				this.articles.push(article);
				this.lastSeen[subreddit] = child.name;
				this.counts[subreddit]++;
			});
		} catch (err) {
			console.log(`[ERR] Failed to fetch reddit posts: ${err}`);
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
