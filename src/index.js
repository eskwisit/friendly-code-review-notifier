import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';

const variations = [
	{
		username: 'Pikachu',
		icon_emoji: 'pikachu-dance',
		text: `Pika! Pika! Pika! Pull requests are piling up. Gotta catch'em all!`,
	},
	{
		username: 'Pyong',
		icon_emoji: 'pyong-excited',
		text: '고등학교는 한국에서 어려워요! Nevermind what it means, I just wanted your attention: PR are stacking up.',
	},
	{
		username: 'Mr. Burns',
		icon_emoji: 'finger-steepling',
		text: 'Smithers! We have to get those PR reviewed quick. They are almost as old as me.',
	},
];

const run = async () => {
	try {
		const payload = [];
		const token = core.getInput('token', { required: true });
		const webhook = core.getInput('webhook', { required: true });
		const treshold = core.getInput('treshold', { required: true });
		const octokit = getOctokit(token);

		const query = await octokit.rest.pulls.list({
			owner: context.repo.owner,
			repo: context.repo.repo,
			state: 'open',
		});

		query.data.forEach((pull_request) => {
			const title = pull_request.title;
			const url = pull_request.url;
			const reviews = pull_request.reviews;

			const block = block_template(title, url, reviews);
			payload.push(block);
		});


		const open_pull_requests = query.data.length;

		const variant = variations[Math.floor(Math.random() * variations.length)];

		payload.unshift(variant);
		payload.push(thank_you_all);

		if (open_pull_requests % treshold === 0 || open_pull_requests > 8) {
			octokit.request(`POST ${webhook}`, {
				data: payload,
				headers: {
					'content-type': 'application/json',
				},
			});
		}
	} catch (error) {
		core.setFailed(error.message);
	}
};

run();

const block_template = (title, url, reviews) => ({
	type: 'section',
	text: {
		type: 'mrkdwn',
		text: `${title} (${reviews} reviews)`,
	},
	accessory: {
		type: 'button',
		text: {
			type: 'plain_text',
			text: 'View',
		},
		url,
		action_id: 'button-action',
	},
});

const thank_you_all = {
	type: 'context',
	elements: [
		{
			type: 'mrkdwn',
			text: 'Thank you all :bow:',
			e
		},
	],
};
