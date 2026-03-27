You must:
1- Run `npm audit`
2- If any lib needs to be audited, run `npm audit fix`
3- If after running `npm audit fix` there are still libs with high or critical situation, you must report what libs are those and propose a change inside package.json dependencies

#Attention

- You must never use `npm audit fix` with --force flag
- On step 3 you must not change, edit or delete any file or dependecy, only give the report and what shoul be done
- Overrides inside package.json are a possible solution, consider it
- Your report must include possible impacts to codebase on change the version of each lib that must be done. For this, you must be aware of its usage at codebase and changed ultil this new version you are suggesting.
