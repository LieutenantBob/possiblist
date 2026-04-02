# Source Reference: Authoritative Data Sources

A practical guide for agents fetching real-world statistics. Includes API endpoints,
data formats, access notes, and known quirks.

---

## Tier 1 Sources

### Our World in Data (OWID)
**URL**: https://ourworldindata.org  
**Data repo**: https://github.com/owid/owid-datasets  
**API**: https://ourworldindata.org/grapher/[chart-slug].csv (direct CSV download)  
**Chart explorer**: https://ourworldindata.org/charts  

**How to use**:
- Search the site for the topic; find the relevant chart
- Append `.csv` to the chart URL to get raw data
- Example: `https://ourworldindata.org/grapher/share-of-population-in-extreme-poverty.csv`
- Data includes country, year, and value columns
- Always check the "Sources" tab on each chart for upstream citation

**Strengths**: Best synthesis of primary sources, excellent methodology notes, covers almost everything  
**Weaknesses**: Data may lag primary sources by 1–2 years  
**Citation format**: "Our World in Data, [chart title], based on [primary source], [year]"

---

### World Bank Open Data
**URL**: https://data.worldbank.org  
**API**: `https://api.worldbank.org/v2/country/all/indicator/[INDICATOR_CODE]?format=json&mrv=1`  
**Indicator search**: https://data.worldbank.org/indicator  

**Common indicator codes**:
| Topic | Indicator Code |
|-------|---------------|
| Extreme poverty (<$2.15/day) | SI.POV.DDAY |
| Child mortality (under-5) | SH.DYN.MORT |
| Life expectancy | SP.DYN.LE00.IN |
| Girls secondary school completion | SE.SEC.CMPT.LO.FE.ZS |
| Access to electricity | EG.ELC.ACCS.ZS |
| Literacy rate, adult | SE.ADT.LITR.ZS |
| GDP per capita (PPP) | NY.GDP.PCAP.PP.CD |
| Maternal mortality ratio | SH.STA.MMRT |
| Immunization, DTP | SH.IMM.IDPT |

**How to use**:
- Replace `[INDICATOR_CODE]` in the API URL
- `mrv=1` returns most recent value; use `mrv=5` for 5 years of trend data
- Add `&country=WLD` for world aggregate
- Returns JSON; look for `value` field in the data array

**Strengths**: Comprehensive, machine-readable, long time series  
**Weaknesses**: Some indicators have significant data gaps for lower-income countries  

---

### Gapminder
**URL**: https://gapminder.org/data  
**Data downloads**: https://www.gapminder.org/data/ (CSV/XLSX per indicator)  
**Tools**: https://tools.gapminder.org (interactive)  

**Key datasets** (download from gapminder.org/data):
- `population.csv` — population by country and year
- `income_per_person.csv` — GDP per capita (inflation adjusted)
- `child_mortality.csv` — deaths per 1000 live births
- `life_expectancy_years.csv`
- `children_per_woman.csv` — fertility rate

**Misconception survey data** (critical for "what people believe"):  
https://www.gapminder.org/ignorance/  
Ipsos survey of 30,000+ people across 28 countries on these exact questions.
See `misconception-surveys.md` for extracted key figures.

**Strengths**: Rosling's original data, time-series going back 200 years, beautiful  
**Weaknesses**: Updates less frequently than World Bank  

---

### WHO Global Health Observatory
**URL**: https://www.who.int/data/gho  
**API**: `https://ghoapi.azureedge.net/api/[INDICATOR_CODE]`  
**Indicator list**: https://ghoapi.azureedge.net/api/Indicator  

**Common indicators**:
| Topic | Indicator Code |
|-------|---------------|
| Tobacco use | M_Est_tob_curr |
| Suicide rate | MH_12 |
| Alcohol consumption | SA_0000001462 |
| Malaria deaths | MALARIA_DEATHS |
| HIV prevalence | HIV_0000000001 |

**Strengths**: Definitive for health statistics, used by governments globally  
**Weaknesses**: API can be slow; some indicators updated only every 2–3 years  

---

### UNICEF Data
**URL**: https://data.unicef.org  
**API**: https://sdmx.data.unicef.org/ws/public/sdmxapi/rest/ (SDMX format)  
**Simpler access**: Download CSVs directly from data.unicef.org per indicator  

**Key topics**: Child mortality, child marriage, stunting/malnutrition, education access  

---

### UN Statistics Division
**URL**: https://unstats.un.org/home/  
**SDG data**: https://unstats.un.org/sdgs/dataportal  
**API**: https://unstats.un.org/SDGAPI/v1/sdg/Indicator/Data  

**Use for**: SDG progress tracking, official UN definitions and baselines  

---

## Tier 2 Sources

### Pew Research Center
**URL**: https://pewresearch.org  
**Data**: Available per report as downloadable datasets  
**Best for**: Public opinion, religion demographics, immigration attitudes, US politics  
**Citation note**: Always check their methodology tab — sample sizes vary significantly  

### OECD Data
**URL**: https://data.oecd.org  
**API**: `https://stats.oecd.org/SDMX-JSON/data/[DATASET]/[FILTER]/OECD`  
**Best for**: Education (PISA), health systems, economic indicators for rich countries  
**Limitation**: Only covers ~38 member countries  

### IMF World Economic Outlook
**URL**: https://imf.org/en/Publications/WEO  
**Data**: https://imf.org/en/Publications/WEO/weo-database  
**Best for**: GDP growth, inflation, debt, economic forecasts  
**Update cycle**: April and October each year  

### Lancet / NEJM
**Access**: Via PubMed abstracts (free); full text sometimes paywalled  
**Best for**: Disease burden, clinical statistics, Global Burden of Disease study  
**Key resource**: Global Burden of Disease (GBD) — https://www.healthdata.org/gbd  

---

## Known Data Quirks & Gotchas

### Poverty statistics
- "Extreme poverty" threshold changed from $1.90 to $2.15/day in 2022 (2017 PPP)
- This makes pre-2022 and post-2022 figures incomparable without adjustment
- Always specify which threshold you're using

### China and India effects
- Global averages are heavily influenced by China and India due to population size
- A global improvement may mask worsening in Sub-Saharan Africa
- Always check if a claim is "global average" vs "most countries"

### Child mortality
- Usually expressed per 1,000 live births
- "Under-5 mortality" and "infant mortality" (under-1) are different measures
- Do not conflate them

### Life expectancy
- "At birth" vs "at age 5" are very different (child mortality skews at-birth downward)
- Period vs cohort life expectancy differ; WHO uses period

### Gender gap statistics
- Definition varies significantly across sources (pay gap, wealth gap, opportunity gap)
- Always specify: raw gap vs adjusted-for-occupation gap

### "Most people think" statistics
- Gapminder surveys are the gold standard here
- Ipsos surveys (run for Gapminder) cover 28 countries, ~30,000 respondents
- Do not invent "most people think X" without a survey citation

---

## Citation Format Templates

**For Fact Cards**:
> [Figure]% of [population] [metric], as of [year]. Source: [Organisation], [Dataset Name], [year].

**For editorial**:
> According to [Organisation]'s [Dataset], the [metric] was [figure] in [year], based on data from [n] countries.

**Never write**:
> "Studies show..." (which studies?)  
> "According to experts..." (which experts?)  
> "The latest data shows..." (what year exactly?)
