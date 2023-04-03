import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';

const run = async () => {
	try {
		const token = core.getInput('token', { required: true });
		const webhook = core.getInput('webhook', { required: true });
		const threshold = core.getInput('threshold', { required: true });
		const limit = core.getInput('limit', { required: true });

		const octokit = getOctokit(token);

		const { owner, repo } = context.repo;

		const query = await octokit.rest.pulls.list({
			owner,
			repo,
			state: 'open',
		});

		const open_pull_requests = query.data.length;

		if (open_pull_requests % threshold === 0 || open_pull_requests > Math.pow(threshold)) {
			const blocks = [];
			const repo_pr_url = `https://github.com/${owner}/${repo}/pulls`;
			const shuffled = limit ? query.data.sort(() => 0.5 - Math.random()).slice(0, limit) : query.data;

			blocks.push(header_template);

			shuffled.forEach(({ title, number, html_url: url }) => {
				const block = block_template(title, url, number);
				blocks.push(block);
			});

			blocks.push(link_to_pull_requests(open_pull_requests, repo_pr_url));
			// blocks.push(thank_you);

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

const header_template = {
	type: 'section',
	text: {
		type: 'mrkdwn',
		text: '*Hey, this is Annoy-o-tron :robot_face: Sorry to interrupt but it seems PRs are stacking up*. What about reviewing the unicorn below?',
	},
};

const divider = {
	type: 'divider',
};

const block_template = (title, url, number) => ({
	type: 'section',
	text: {
		type: 'mrkdwn',
		text: `:unicorn_face:  <${url}|${title}> #${number}`,
	},
	accessory: {
		type: 'button',
		text: {
			type: 'plain_text',
			text: 'Review',
		},
		url,
	},
});

const link_to_pull_requests = (length, repo_url) => ({
	type: 'section',
	text: {
		type: 'mrkdwn',
		text: `<${repo_url}|Click here> to see the full list of PR (${length}). Thank you :bow:`,
	},
});

const thank_you = {
	type: 'context',
	elements: [
		{
			type: 'mrkdwn',
			text: 'Thank you very much :bow:',
		},
	],
};
