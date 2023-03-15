# friendly-code-review-notifier

## Usage

```yml
# .github/workflows/friendly-code-review-notifier
---
name: Friendly Code Review Notifier
on:
  pull_request_target:
    types: [opened, reopened]
jobs:
  friendly-code-review-notifier:
    runs-on: ubuntu-latest
    steps:
      - uses: mxxlrfu/friendly-code-review-notifier@v1.0.0
        with:
          webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
```
