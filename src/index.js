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
		const token = core.getInput('token', { required: true });
		const webhook = core.getInput('webhook', { required: true });
		const threshold = core.getInput('threshold', { required: true });
		const octokit = getOctokit(token);

		const query = await octokit.rest.pulls.list({
			owner: context.repo.owner,
			repo: context.repo.repo,
			state: 'open',
		});

		const open_pull_requests = query.data.length;

		if (open_pull_requests % threshold === 0 || open_pull_requests > threshold * 3) {
			let payload = variations[Math.floor(Math.random() * variations.length)];
			const blocks = [];

			blocks.push({
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `*${payload.text}* What about these? :slightly_smiling_face:`,
				},
			});

			blocks.push({
				type: 'divider',
			});

			const shuffled = query.data.sort(() => 0.5 - Math.random()).slice(0, 3);

			shuffled.forEach(({ title, number, reviews }) => {
				const url = `https://github.com/jobcloud/marketplace-client/pull/${number}`;
				const block = block_template(title, url, reviews);
				blocks.push(block);
			});

			blocks.push(thank_you_all);

			payload = {
				...payload,
				blocks,
			};

			octokit.request(`POST ${webhook}`, {
				data: payload,
				headers: {
					'content-type': 'application/json',
				},
			});
		} else {
			core.info(`Nothing to notify right now 👌`);
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
		text: `${title}`,
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
		},
	],
};
