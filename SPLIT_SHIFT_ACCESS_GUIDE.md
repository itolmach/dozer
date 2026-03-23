# How to Access Split-Shift Cost Coding

## Access Path

### **Step 1: Open Asset Initialization Settings**
**Location**: Top of the dashboard in the Asset Header section

1. Look for the **gear/cog icon** (⚙️) in the asset header next to the asset status
2. Hover text: "Asset Initialization Settings"
3. **Click the Settings icon** → Opens "Asset Initialization - Genesis Flow" modal

### **Step 2: Navigate to Cost Code Step**
In the Asset Initialization modal:

1. You'll see 4 progress steps at the top:
   - Asset ID
   - **Cost Code** ← Click this
   - Map Areas
   - Review

2. Click on the **"Cost Code"** step

### **Step 3: Select a Primary Cost Code**
1. Choose any cost code from the list (e.g., "CSI 31 23 00 - Mass Earthwork")
2. Once selected, a new section appears below titled:
   **"Mid-Task Reallocation (Split-Shift)"**

### **Step 4: Open Split-Shift Modal**
1. In the dashed border box, click the black button:
   **"Configure Split-Shift"**
2. This opens the full **Split-Shift Cost Code Assignment** modal

---

## Quick Navigation Summary

```
Main Dashboard
    ↓
Asset Header → ⚙️ Settings Icon
    ↓
Asset Initialization Modal → Step 2: Cost Code
    ↓
Select Primary Cost Code
    ↓
"Configure Split-Shift" Button (appears below cost code selection)
    ↓
Split-Shift Modal Opens ✅
```

---

## What You'll See in Split-Shift Modal

### Header
- **Title**: "Split-Shift Cost Code Assignment"
- **Subtitle**: Asset name and "Mid-Task Reallocation"

### Main Features
1. **Original Task Info**: Shows current cost code and start time
2. **Time Splits Section**: Timeline entries with:
   - Start Time (HH:MM)
   - End Time (HH:MM)
   - Duration (minutes)
   - % of Shift
3. **Add New Split Section**:
   - New cost code dropdown
   - Reason for change dropdown
   - "Add Split at Current Time" button
4. **Summary**: Total splits, duration, and cost codes affected

### Actions
- **Cancel**: Close without saving
- **Save Split-Shift Assignment**: Save proportional cost allocations

---

## Example Workflow

### Scenario: Asset needs reallocation from Mass Earthwork to Stockpiling

1. **Click Settings ⚙️** in asset header
2. **Navigate to "Cost Code"** step
3. **Select** "CSI 31 23 00 - Mass Earthwork"
4. **Click** "Configure Split-Shift" button
5. **Set end time** for current task (e.g., 10:15 AM)
6. **Select new cost code**: "CSI 31 25 14 - Stockpiling"
7. **Select reason**: "Site Bottleneck - Stockpile Full"
8. **Click** "Add Split at Current Time"
9. **Set end time** for new split (e.g., 3:00 PM)
10. **Review** proportional allocation (e.g., 37% / 63%)
11. **Click** "Save Split-Shift Assignment"

Result: All fuel, labor, and machine costs proportionally allocated between two cost codes based on time spent.

---

## Design Details

- **Touch Targets**: All buttons are 60x60px minimum (safety glove friendly)
- **Color Scheme**: Pure monochrome (black/white/gray)
- **Contrast**: 21:1 ratio for outdoor readability
- **Typography**: Inter font family throughout
- **Theme**: All colors from CSS design system variables
