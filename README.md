# Row Nine

> **INTENTIONALLY VULNERABLE — DEMO ONLY, do not deploy.**

Private walkthrough app for Cursor Security Reviewer. The app on `main` is a small, safe event-ticketing site. A separate branch, `feature/promo-links`, is what the presenter opens live. There is no real authentication, payment, or customer data. Do not deploy this app.

## Run locally

Node.js 18 or newer.

```bash
npm install
npm start
```

Open http://localhost:3000.

| Route | What it does |
| --- | --- |
| `GET /` | Events on sale |
| `GET /events/:id` | Event page |
| `GET /search?q=` | Search |
| `GET /login`, `POST /login` | Fake sign-in, then a same-site return path |

## Demo script

1. Merge the baseline pull request so `main` is this safe app.
2. From `feature/promo-links`, open a pull request into `main`. Use an ordinary feature title. Do not describe defects in the title or body.
3. Let Security Reviewer run. It should comment with the attack path and a fix, and file one Jira issue per confirmed finding in project **SEC**. Paste-in instructions: `docs/security-reviewer-instructions.md`.
4. Choose **Fix in Cursor**. The fix pull request needs the Jira key (`SEC-` followed by digits) in its title, head branch name, or body.
5. Merge the fix pull request. The workflow below moves that issue to Done and comments with the PR link. Jira's own "pull request merged" rule can do this too; the workflow is the fallback.

## Jira close on merge

Workflow: `.github/workflows/jira-close-on-merge.yml`

When a pull request is closed and merged, the job looks for the first `SEC-<number>` key in the title, then the head branch name, then the body. If none is present, it exits successfully and does nothing.

If a key is present, it reads the issue, looks up transitions with `GET /rest/api/3/issue/{key}/transitions`, and posts the transition whose destination status name matches the target (or whose transition name matches, if the button label differs from the status). It does not hardcode a transition id. It then adds a comment linking the merged pull request. If the issue is already in the target status, it skips the transition and still comments.

### Secrets and variables

Add these in GitHub under **Settings → Secrets and variables → Actions**. Never commit them.

Repository secrets:

| Name | Value |
| --- | --- |
| `JIRA_BASE_URL` | `https://fe-anysphere-demo.atlassian.net` |
| `JIRA_EMAIL` | Atlassian account email for the API token |
| `JIRA_API_TOKEN` | Token from [Atlassian API tokens](https://id.atlassian.com/manage-profile/security/api-tokens) |

Repository variable (optional):

| Name | Value |
| --- | --- |
| `JIRA_DONE_STATUS` | `Done` |

Unset `JIRA_DONE_STATUS` means `Done`. The Jira user needs access to view the issue, transition it, and comment.

## Security Reviewer instructions

`docs/security-reviewer-instructions.md`
