interface IArticle {
	type: string;
	headline: string;
	source: string;
}

export default class Article implements IArticle {
	type: string;
	headline: string;
	source: string;
	domain: string;

	constructor(subreddit: string, headline: string, source: string, domain: string) {
		this.type = subreddit;
		this.headline = headline;
		this.source = source;
		this.domain = domain;
	}

	prettyName() {
		return this.type === 'theonion' ? 'The Onion' : 'not The Onion';
	}
}
