# Claude Code Instructions

## Commit Messages & PRs
- Never add a `Co-Authored-By: Claude` trailer or any other Claude attribution to commits or PR descriptions
- Never mention Claude, Claude Code, or AI in commit messages or PR descriptions
- Keep commit messages focused on what changed, not who or what made the changes

## Workflow
- Commit and push to `main` after every change, so the live site (hikingpassportapp.com) updates for review. Pushing deploys automatically.
- Push with `git -c http.version=HTTP/1.1 push` if the push fails partway with an SSL error.
