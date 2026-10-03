# Security Reviewer custom instructions

Paste the block below into this repository's Security Reviewer custom instructions. Edit the project key, issue type, or field names in place if the Jira screen differs.

```
Review this pull request as usual, and also check for:

- Cross-site scripting, reflected and stored, including unsafe HTML rendering of query parameters, form fields, or saved copy.
- Unvalidated and open redirects, including next, return, url, or redirect values sent to a redirect or used as a post-login destination.

For each confirmed finding, create one Jira issue in project SEC, issue type Vulnerability. Do not file another issue for the same file and location if one is already open, or if this review already filed one.

Include:

- Summary: short name of the finding and where it is
- Severity: Critical, High, Medium, or Low
- Source: Cursor Security Reviewer (use the description if there is no Source field)
- Repo: this repository
- PR link: this pull request
- Attack path
- Recommended fix

Mention the new issue key in the review comment so the follow-up fix pull request can include it in the title, branch name, or body.
```
