# Habit Tracker Excel Template Setup Guide

This guide will help you create a fully functional Excel habit tracker that matches the app's business logic.

## Step 1: Open the CSV Template

1. Open `habit_tracker_template.csv` in Excel
2. Save it as an Excel file (`.xlsx`)

## Step 2: Set Up the Structure

### Column Layout
- **Column A**: Habit names
- **Columns B-AC**: Days of the month (28-31 days depending on month)
- Group columns into weeks visually (Week 1, Week 2, Week 3, Week 4/5)

### Row Layout
- **Row 1**: Month name and year
- **Row 2**: Number of habits
- **Row 3**: Completed habits count
- **Row 4**: Monthly progress percentage
- **Row 5**: Week headers (Week 1, Week 2, etc.)
- **Row 6**: Day abbreviations (Sa, Su, Mo, Tu, We, Th, Fr)
- **Row 7**: Day numbers (1, 2, 3, etc.)
- **Rows 8+**: Habit rows with checkboxes
- **Second-to-last row**: Progress percentages
- **Last row**: Done counts
- **Very last row**: Not Done counts

## Step 3: Add Formulas

### For "Number of habits" (Cell B2):
```
=COUNTA(A8:A100)-COUNTBLANK(A8:A100)
```
This counts non-empty habit names.

### For "Completed habits" (Cell B3):
```
=COUNTIF(B8:AC100,"✓")
```
This counts all checkmarks in the grid.

### For "Progress" (Cell B4):
```
=ROUND((B3/(B2*DAY(EOMONTH(DATE(2024,11,1),0))))*100,2)&"%"
```
This calculates: `(Completed habits) / (Total habits × Days in month) × 100`

**Note**: Update the date `DATE(2024,11,1)` to match your current month.

### For Daily Progress Row (e.g., Row 8):
For each day column (B, C, D, etc.), calculate the percentage:
```
=ROUND((COUNTIF(B8:B17,"✓")/$B$2)*100,0)&"%"
```
- `COUNTIF(B8:B17,"✓")` counts checkmarks in that day's column
- `$B$2` is the total number of habits (absolute reference)
- Adjust row range (B8:B17) based on where your habits start/end

### For "Done" Row:
For each day column:
```
=COUNTIF(B8:B17,"✓")
```
Counts how many habits were completed that day.

### For "Not Done" Row:
For each day column:
```
=$B$2-COUNTIF(B8:B17,"✓")
```
Total habits minus done count.

## Step 4: Add Checkboxes

### Option A: Use Checkbox Form Controls (Recommended)
1. Go to **Developer** tab → **Insert** → **Form Controls** → **Checkbox**
2. Draw checkboxes in each cell
3. Link each checkbox to a cell (hidden column) that contains TRUE/FALSE
4. Use conditional formatting to show ✓ when TRUE

### Option B: Use Data Validation (Simpler)
1. Select all habit cells (B8:AC100)
2. Go to **Data** → **Data Validation**
3. Choose **List** → Source: `✓,`
4. Users can select ✓ from dropdown or type it

### Option C: Manual Entry
- Just type `✓` or `x` in cells
- Use conditional formatting to color code

## Step 5: Formatting

### Color Scheme (Matching FocusDot)
- **Background**: Dark gray/black (#1e1e1e or similar)
- **Text**: White/light gray
- **Completed cells**: Green background (#10b981)
- **Empty cells**: Dark gray background
- **Headers**: Light gray text

### Conditional Formatting for Checkboxes
1. Select habit cells (B8:AC100)
2. **Home** → **Conditional Formatting** → **New Rule**
3. Choose "Format cells that contain"
4. Set: "Cell value" → "equal to" → `✓`
5. Format: Green fill, white text

### Progress Bar (Optional)
For the progress cell (B4), you can add a data bar:
1. Select B4
2. **Home** → **Conditional Formatting** → **Data Bars**
3. Choose green color

## Step 6: Month Navigation

### Create Month Selector
1. Add a dropdown in cell A1 for month selection
2. Use **Data Validation** → **List** → Source: `January,February,March,April,May,June,July,August,September,October,November,December`
3. Update formulas to reference the selected month

### Dynamic Date Calculation
For the days in month calculation, use:
```
=DAY(EOMONTH(DATE(YEAR(TODAY()),MONTH(A1&" 1"),1),0))
```
Where A1 contains the month name.

## Step 7: Week Grouping

Visually group columns:
1. Select columns for Week 1 → **Format** → **Group**
2. Repeat for Week 2, Week 3, Week 4
3. Add borders between weeks for clarity

## Step 8: Progress Chart (Optional)

1. Select the Progress row data
2. **Insert** → **Chart** → **Line Chart** or **Area Chart**
3. Format with green color (#10b981)
4. Add to a separate sheet or below the grid

## Quick Reference: Key Formulas

| Purpose | Formula |
|---------|---------|
| Total habits | `=COUNTA(A8:A100)-COUNTBLANK(A8:A100)` |
| Completed this month | `=COUNTIF(B8:AC100,"✓")` |
| Monthly progress % | `=(B3/(B2*DAY(EOMONTH(DATE(2024,11,1),0))))*100` |
| Daily done count | `=COUNTIF(B8:B17,"✓")` |
| Daily not done | `=$B$2-COUNTIF(B8:B17,"✓")` |
| Daily progress % | `=(COUNTIF(B8:B17,"✓")/$B$2)*100` |

## Tips

1. **Freeze Panes**: Freeze the habit name column (A) so it stays visible when scrolling
2. **Protect Sheet**: Protect formulas while allowing checkbox editing
3. **Auto-save**: Enable auto-save or save frequently
4. **Print Setup**: Set print area to include only the grid, not formulas

## Matching App Logic

The Excel formulas match the app's business logic exactly:
- ✅ Done = COUNTIF for checkmarks
- ✅ Not Done = Total - Done
- ✅ Daily Progress = Done / Total × 100
- ✅ Monthly Progress = Total Completed / (Total Habits × Days in Month) × 100

Enjoy tracking your habits! 🎯

