import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';

const run = async () => {
	try {
		const token = core.getInput('token', { required: true });
		const webhook = core.getInput('webhook', { required: true });
		const threshold = core.getInput('threshold', { required: true });
		const octokit = getOctokit(token);

		const { owner, repo } = context.repo;

		const query = await octokit.rest.pulls.list({
			owner,
			repo,
			state: 'open',
		});

		const open_pull_requests = query.data.length;

		if (open_pull_requests % threshold === 0 || open_pull_requests > threshold * 3) {
			const blocks = [];

			blocks.push({
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `*Oops, it looks like PRs are stacking up :notawesome: What about giving a look at these?* :arrow_heading_down:`,
				},
			});

			blocks.push({
				type: 'divider',
			});

			const shuffled = query.data.sort(() => 0.5 - Math.random()).slice(0, 3);

			shuffled.forEach(({ title, number, reviews }) => {
				const url = `https://github.com/${owner}/${repo}/pull/${number}`;
				const block = block_template(title, url, reviews);
				blocks.push(block);
			});

			blocks.push(thank_you_all);

			const payload = { blocks };

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
