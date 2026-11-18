# GitHub setup, Git workflow, and deployment

This guide applies to the single-page portfolio in this folder. The site uses HTML, CSS, and vanilla JavaScript only. It has no build step and deploys through the GitHub Actions workflows in `.github/workflows/`.

## 1. Check the project structure

Keep the repository root organized like this:

```text
profile-website/
|-- index.html
|-- css/
|   |-- theme.css
|   `-- style.css
|-- js/
|   `-- main.js
|-- images/
|   |-- hero/profile-photo.jpg
|   `-- hobbies/
|       |-- doodle.jfif
|       |-- art.jfif
|       |-- Paint.jfif
|       `-- Mandala.jfif
|-- .github/workflows/
|   |-- validate.yml
|   |-- deploy.yml
|   |-- pr-checks.yml
|   |-- lighthouse.yml
|   `-- notify.yml
|-- .htmlhintrc
|-- .gitignore
|-- README.md
`-- DEPLOYMENT.md
```

Add the supplied personal portrait at `images/hero/profile-photo.jpg` before publishing. The hobby photos belong to the existing Doodling, Art, Painting, and Mandala Art cards.

## 2. Create the GitHub repository

1. Sign in to GitHub and create a repository named `profile-website`.
2. Make it public if the assignment reviewer must open the site without signing in.
3. Do not add a README or license during repository creation if you will push this folder as the initial repository; the project already contains its README.
4. In a terminal, open this project folder and verify `git status` shows the files you expect.
5. If this folder is already connected to the intended GitHub repository, keep that remote. Otherwise, replace the origin URL with your repository URL:

```bash
git remote -v
git remote set-url origin https://github.com/<your-username>/profile-website.git
```

To start with the included repository history, inspect the current branch and remotes first. Then push the branch to GitHub:

```bash
git branch --show-current
git push -u origin main
```

If the GitHub repository already has unrelated commits, clone it first and copy the project files into that clone rather than force-pushing over its history.

## 3. Use the assignment branch model

`main` is production and deploys automatically. `develop` is the integration branch. Build each change on a short-lived branch created from `develop`; open a pull request into `develop`, review it, and merge it. When a complete milestone is ready, open a pull request from `develop` to `main`.

Example branch names from the assignment:

```text
main
└── develop
    ├── feature/hero-section
    ├── feature/journey-timeline
    ├── feature/interests-cards
    ├── feature/family-section
    ├── feature/hobbies-gallery
    ├── theme/dark-mode
    ├── theme/warm-tones
    ├── ci/setup-validation
    ├── ci/setup-deploy
    ├── ci/setup-pr-checks
    ├── ci/setup-lighthouse
    └── ci/setup-notifications
```

Create branches and make changes through pull requests; do not commit directly to `main`. The assignment asks for at least one peer review before merge. Do not claim a review until a real reviewer has approved the pull request.

For a theme-only assignment exercise, create a branch such as `theme/dark-mode`, edit only `css/theme.css`, commit, push, and open a pull request. The CSS layout and HTML should not need edits for a color theme change.

## 4. Configure repository protection and Pages

1. In GitHub, open **Settings → Pages** and set the build and deployment source to **GitHub Actions**.
2. Under **Settings → Actions → General**, allow GitHub Actions to run.
3. Under **Settings → Branches** (or **Rules**), add a rule for `main` that requires a pull request and at least one approval. Require the `all-checks-passed` status check from the PR Quality Checks workflow before merging.
4. Keep the deployment workflow permissions: `contents: read`, `pages: write`, and `id-token: write`. The workflow creates the `github-pages` environment and deploys the uploaded artifact.
5. Optional Slack notifications: create a Slack incoming webhook, then add it in **Settings → Secrets and variables → Actions → New repository secret** with the exact name `SLACK_WEBHOOK_URL`. Never commit the webhook URL to the repository. Without the secret, the workflow reports deployment status in Actions logs only.

## 5. Understand the five workflows

| Workflow | File | What it does |
| --- | --- | --- |
| HTML and CSS validation | `validate.yml` | Runs HTMLHint and CSSLint on pushes to `main` and `develop`, and on pull requests to `main`. |
| GitHub Pages deployment | `deploy.yml` | On a push to `main`, uploads the site and deploys it to GitHub Pages. |
| Pull request checks | `pr-checks.yml` | Checks HTML titles, image alt text, and `console.log`; `all-checks-passed` waits for each check. |
| Lighthouse audit | `lighthouse.yml` | Audits after deployment and every Monday at 09:00 UTC; saves a report artifact for 30 days. |
| Deployment notification | `notify.yml` | Reports success or failure in Actions logs and sends a Slack message when `SLACK_WEBHOOK_URL` is configured. |

Open the repository **Actions** tab to review runs. A failed check blocks the corresponding workflow; open its run and read the first failing step before changing code.

## 6. Deploy and verify the live site

1. Merge the reviewed release pull request into `main`.
2. Open **Actions → Deploy to GitHub Pages** and wait for the deployment job to finish successfully.
3. Open the Pages URL shown by the deployment. For a repository called `profile-website`, the default URL is `https://<your-username>.github.io/profile-website/`.
4. Check the home navigation, every section link, the mobile menu, timeline expand buttons, hobby image cards and lightbox, footer links, and back-to-top control.
5. Test the page at desktop width and at a narrow mobile width. Confirm all five workflow files are present and inspect the Lighthouse report artifact after the audit completes.

For a project site, GitHub Pages serves the repository at `/<repository-name>/`. Keep asset URLs relative (for example, `images/hobbies/doodle.jfif`) so the files load at that path.

## 7. Preview locally

No framework or package installation is needed. Open `index.html` directly, or start a simple local server from the project root:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`. Stop the server with `Ctrl+C` when finished.

## 8. Assignment completion evidence

Keep the GitHub repository URL, the deployed Pages URL, successful Actions runs, pull request links, at least one peer approval, and a downloadable Lighthouse artifact available for submission. The ZIP contains the website source and workflow configuration; GitHub must run the workflows and record the pull requests and approvals after you push it to your account.
