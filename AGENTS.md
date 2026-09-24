# Loanch Development Instructions

- Read `Loanch.md` and `PRD.md` completely before making significant changes.
- Treat `Loanch.md` as the source of truth for product scope and business rules.
- Treat `PRD.md` as the source of truth for technical architecture and implementation.
- Treat `DESIGN.md` as the source of truth for front end page design.
- Do not change product scope or financial rules unless explicitly requested.
- Keep implementation incremental and verify each completed step.
- When adding or updating Animate UI/shadcn components, use the configured `shadcn` MCP registry server first and keep generated UI aligned with `DESIGN.md`.

When changing smart contract logic:

1. Explain the affected invariant.
2. Update tests.
3. Run the complete test suite.
4. Run relevant security checks.
