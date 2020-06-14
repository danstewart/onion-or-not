<template>
	<div id='app'>
		<!-- Hero -->
		<section class='hero is-primary is-bold is-medium'>
			<div class='hero-body'>
				<div class='container'>
					<h1 class='title is-1'>The Onion or not?</h1>
					<p class='is-family-monospace is-size-5'>SCORE: {{ score[0] }}/{{ score[1] }}</p>
				</div>
			</div>
		</section>

		<!-- Article -->
		<section class='section'>
			<div class='headline'>
				<h3 class='title is-3'>{{ article.headline }}</h3>
			</div>
		</section>
		
		<!-- Controls -->
		<section class='section'>
			<p class='subtitle'>Was it...<a @click='choice("theonion")'>The Onion</a> or <a @click='choice("nottheonion")'>not The Onion</a></p>
		</section>

		<!-- Result -->
		<section class='section' v-if='showResult'>
			<p class='subtitle is-3'>{{ correct ? "Correct" : "Wrong" }} it was <b>{{ article.prettyName() }}</b></p>
			<p class='subtitle is-6'><a :href='article.source'>Read the story</a></p>
			<button class='button' @click='next()'>Next</button>
		</section>

		<!-- Empty space -->
		<!-- So when picking an answer the page doesn't jump up on mobile -->
		<section style='margin-top: 200px' class='section' v-if='!showResult'>
		</section>
	</div>
</template>

<script lang='ts'>
import Article from './Article';
import Articles from './Articles';
import 'bulma/css/bulma.css';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {
	article: Article = new Article('', '', '', '');
	articles: Articles = new Articles();

	score: [number, number] = [0, 0];
	showResult: boolean = false;
	correct: boolean = false;

	constructor() {
		super();
	}

	async created() {
		// Load articles
		await this.articles.init();

		// Get an article
		this.article = this.articles.getArticle();
	}

	choice(option: string) {
		// If we've just picked a result then don't allow changing the answer
		if (this.showResult) return;

		this.showResult = true;
		this.correct = option === this.article.type;

		if (this.correct) this.score[0]++;
		this.score[1]++;
	}

	next() {
		this.showResult = false;
		this.article = this.articles.getArticle();
	}
}
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

.hero {
	margin-bottom: 40px;
}
</style>
