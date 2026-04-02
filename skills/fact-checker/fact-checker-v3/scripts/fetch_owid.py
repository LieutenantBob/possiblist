#!/usr/bin/env python3
"""
fetch_owid.py — Pull data from Our World in Data

Usage:
  python fetch_owid.py --chart "share-of-population-in-extreme-poverty"
  python fetch_owid.py --chart "child-mortality" --country OWID_WRL
  python fetch_owid.py --search "literacy rate"

Our World in Data exposes chart data as CSVs via:
  https://ourworldindata.org/grapher/[chart-slug].csv
"""

import argparse
import sys
import urllib.request
import urllib.parse
import csv
import io
import json


OWID_BASE = "https://ourworldindata.org/grapher/"
OWID_SEARCH = "https://ourworldindata.org/search?q="


def fetch_chart_csv(slug: str, country_code: str = None) -> list[dict]:
    """
    Fetch chart data as CSV from OWID.
    
    Args:
        slug: Chart slug (e.g. 'share-of-population-in-extreme-poverty')
        country_code: Optional OWID country code (e.g. 'OWID_WRL' for World)
    
    Returns:
        List of dicts with chart data rows
    """
    url = f"{OWID_BASE}{slug}.csv"
    
    print(f"Fetching: {url}", file=sys.stderr)
    
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "FactChecker/1.0"})
        with urllib.request.urlopen(req, timeout=15) as response:
            content = response.read().decode("utf-8")
    except Exception as e:
        print(f"ERROR fetching {url}: {e}", file=sys.stderr)
        return []
    
    reader = csv.DictReader(io.StringIO(content))
    rows = list(reader)
    
    # Filter by country if specified
    if country_code:
        rows = [r for r in rows if r.get("Code") == country_code or r.get("Entity") == country_code]
    
    return rows


def get_latest_world(slug: str) -> dict | None:
    """Get the most recent world-level data point for a chart."""
    rows = fetch_chart_csv(slug, country_code="OWID_WRL")
    if not rows:
        # Try without country filter — some charts use different entity names
        rows = fetch_chart_csv(slug)
        rows = [r for r in rows if r.get("Entity", "").lower() in ("world", "owid_wrl")]
    
    if not rows:
        return None
    
    # Sort by year descending, get most recent
    try:
        rows.sort(key=lambda r: int(r.get("Year", 0)), reverse=True)
        return rows[0]
    except (ValueError, TypeError):
        return rows[-1]  # Last row if year parsing fails


def fetch_worldbank(indicator: str, country: str = "WLD", mrv: int = 1) -> dict | None:
    """
    Fetch World Bank indicator data.
    
    Args:
        indicator: WB indicator code (e.g. 'SI.POV.DDAY')
        country: Country code ('WLD' for world, 'CHN' for China, etc.)
        mrv: Number of most recent values to return
    
    Returns:
        Most recent data point as dict
    """
    url = (
        f"https://api.worldbank.org/v2/country/{country}/indicator/{indicator}"
        f"?format=json&mrv={mrv}&per_page=5"
    )
    
    print(f"Fetching World Bank: {url}", file=sys.stderr)
    
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "FactChecker/1.0"})
        with urllib.request.urlopen(req, timeout=15) as response:
            data = json.loads(response.read().decode("utf-8"))
    except Exception as e:
        print(f"ERROR fetching World Bank {indicator}: {e}", file=sys.stderr)
        return None
    
    if not isinstance(data, list) or len(data) < 2:
        print(f"Unexpected World Bank response format", file=sys.stderr)
        return None
    
    records = data[1]
    if not records:
        print(f"No data returned for {indicator}", file=sys.stderr)
        return None
    
    # Filter to most recent non-null value
    for record in records:
        if record.get("value") is not None:
            return {
                "indicator": indicator,
                "indicator_name": record.get("indicator", {}).get("value", ""),
                "country": record.get("country", {}).get("value", ""),
                "year": record.get("date", ""),
                "value": record.get("value"),
                "unit": "",  # World Bank doesn't always provide units inline
                "source": f"World Bank Open Data — {indicator}",
                "url": f"https://data.worldbank.org/indicator/{indicator}"
            }
    
    return None


def format_fact_source(data: dict, notes: str = "") -> str:
    """Format a data record as a Fact Card source line."""
    value = data.get("value", "N/A")
    if isinstance(value, float):
        value = f"{value:.1f}"
    
    return (
        f"| {data.get('source', 'Unknown')} "
        f"| {value}{data.get('unit', '')} "
        f"| {data.get('year', 'N/A')} "
        f"| {notes} |"
    )


def main():
    parser = argparse.ArgumentParser(description="Fetch data for fact-checking")
    subparsers = parser.add_subparsers(dest="command")
    
    # OWID chart command
    owid_parser = subparsers.add_parser("owid", help="Fetch Our World in Data chart")
    owid_parser.add_argument("--chart", required=True, help="Chart slug")
    owid_parser.add_argument("--country", default="OWID_WRL", help="Country code")
    owid_parser.add_argument("--latest", action="store_true", help="Get latest world value only")
    
    # World Bank command
    wb_parser = subparsers.add_parser("worldbank", help="Fetch World Bank indicator")
    wb_parser.add_argument("--indicator", required=True, help="Indicator code")
    wb_parser.add_argument("--country", default="WLD", help="Country code")
    
    args = parser.parse_args()
    
    if args.command == "owid":
        if args.latest:
            result = get_latest_world(args.chart)
            if result:
                print(json.dumps(result, indent=2))
            else:
                print("No data found", file=sys.stderr)
                sys.exit(1)
        else:
            rows = fetch_chart_csv(args.chart, args.country)
            print(json.dumps(rows, indent=2))
    
    elif args.command == "worldbank":
        result = fetch_worldbank(args.indicator, args.country)
        if result:
            print(json.dumps(result, indent=2))
            print("\n--- Formatted for Fact Card ---")
            print(format_fact_source(result))
        else:
            print("No data found", file=sys.stderr)
            sys.exit(1)
    
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
