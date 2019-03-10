interface IArticle {
	type: string;
	headline: string;
	source: string;
}

export default class Article implements IArticle {
	type: string;
	headline: string;
	source: string;

	constructor(subreddit: string, headline: string, source: string) {
		this.type = subreddit;
		this.headline = headline;
		this.source = source;
	}

	prettyName() {
		return this.type === 'theonion' ? 'The Onion' : 'not The Onion';
	}
}
