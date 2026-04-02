# Fact-Checker Skill — Usage Notes

## Environment Requirements

The `scripts/fetch_owid.py` and `scripts/fetch_worldbank.py` scripts require
**outbound internet access** to hit external APIs. This means:

- ✅ **Claude Code (your machine)**: Scripts work fully — run them via bash tool
- ✅ **Claude Code with web search**: Agents can use web search to fetch data
- ❌ **Claude.ai sandbox**: External API calls are blocked — use web search instead

## In Claude Code

Claude Code agents can:
1. Run `python scripts/fetch_owid.py worldbank --indicator SI.POV.DDAY` directly
2. Use web search to retrieve OWID chart pages and extract figures
3. Fetch World Bank API responses via curl/requests

## Recommended Claude Code Workflow

When running the fact-checker in Claude Code, spawn agents using:
```
claude -p "You are Agent Alpha. Research task: [claim]. 
Use scripts/fetch_owid.py and web search. 
Output a JSON fact record." &

claude -p "You are Agent Beta. Research task: [claim].
Find an INDEPENDENT source from Agent Alpha.
Output a JSON fact record." &

wait  # collect both results, then run synthesis
```

## Manual Web Fallback (Claude.ai)

When in Claude.ai, agents use web search to:
- Search OWID chart pages directly
- Search World Bank data pages
- Search WHO/UNICEF data portals
- Cross-reference via web search results

The SKILL.md orchestration logic is identical — only the data retrieval method differs.
