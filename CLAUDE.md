# CLAUDE.md

This file provides guidance for AI assistants (Claude and others) working with this repository.

## Repository Overview

- **Name:** r
- **Owner:** lraznasl-sys
- **Status:** Newly initialized repository (minimal structure as of February 2026)
- **Description:** No description has been provided yet. Update this file as the project evolves.

## Current Structure

```
r/
├── README.md       # Minimal project README
└── CLAUDE.md       # This file
```

The repository currently contains only an initial commit with a placeholder README. As the project grows, update this file to reflect the actual structure, tech stack, and conventions.

## Development Workflow

### Branching

- The default branch is `master`
- Feature branches should be created from `master`
- Branch naming convention: use descriptive names (e.g., `feature/add-auth`, `fix/login-bug`)

### Commits

- Write clear, imperative commit messages (e.g., "Add user authentication", not "Added auth")
- Keep commits focused on a single logical change
- Reference issue numbers in commit messages where relevant (e.g., `Fix login redirect (#42)`)

### Git Workflow

```bash
# Create a feature branch
git checkout -b feature/your-feature master

# Stage and commit changes
git add <specific-files>
git commit -m "Descriptive commit message"

# Push branch to remote
git push -u origin feature/your-feature
```

## Conventions for AI Assistants

### Before Making Changes

1. Read all relevant files before modifying them
2. Understand existing patterns and conventions in the codebase before introducing new ones
3. Prefer editing existing files over creating new ones
4. Keep changes minimal and focused on the task at hand

### Code Style

- Follow the language-specific conventions once a tech stack is established
- Do not add unnecessary comments, docstrings, or type annotations to code you didn't change
- Avoid over-engineering: write the minimum code needed for the current task
- Do not add error handling for scenarios that cannot happen

### Security

- Never commit secrets, credentials, API keys, or environment files (`.env`, etc.)
- Validate input at system boundaries (user input, external APIs), not internally
- Avoid introducing OWASP Top 10 vulnerabilities (SQL injection, XSS, command injection, etc.)

### Testing

- Run existing tests before and after making changes
- Do not break existing test coverage
- Add tests for new functionality when a testing framework is in place

## Updating This File

This `CLAUDE.md` should be kept up to date as the project evolves. Update it when:

- A tech stack or framework is chosen
- New development dependencies are added
- Build, test, or lint commands are established
- Coding conventions or architecture decisions are made
- New team workflows are adopted

## Getting Started (Template)

Once the project is set up, document the development setup here. Example:

```bash
# Install dependencies
# <command here>

# Run tests
# <command here>

# Start development server
# <command here>

# Run linter
# <command here>
```
