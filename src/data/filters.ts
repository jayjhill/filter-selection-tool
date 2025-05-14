export interface Filter {
    Model: string;
    'Filter Type': 'Separator' | 'VAF' | 'Vortisand';
    hp: number;
    'Flow Rate': number;
    'Min Recirc (gallons)': number;
    'Max Recirc (gallons)': number;
    'Tonnage Min': number;
    'Tonnage Max': number;
    'Loop Min': number | null; // Can be empty
    'Loop Max': number | null; // Can be empty
    OPEX_formula_ref_col: string; // e.g., C2, C3 -> implies 'hp'
    Description: string;
  }
  
  // Helper to parse numbers that might have commas
  const parseNum = (val: string | undefined | null): number => {
    if (val === null || val === undefined || val.trim() === "") return 0; // Or handle as NaN/error
    return parseFloat(val.replace(/,/g, ''));
  };
  
  
  export const filtersData: Filter[] = [
    {
      Model: "LCS120", "Filter Type": "Separator", hp: 3, "Flow Rate": 120, "Min Recirc (gallons)": 0, "Max Recirc (gallons)": 600, "Tonnage Min": 0, "Tonnage Max": 200, "Loop Min": null, "Loop Max": null, OPEX_formula_ref_col: "hp", Description: "VHS-120 Hydrocyclone Separator..."
    },
    {
      Model: "LCS180", "Filter Type": "Separator", hp: 5, "Flow Rate": 180, "Min Recirc (gallons)": 601, "Max Recirc (gallons)": 900, "Tonnage Min": 201, "Tonnage Max": 300, "Loop Min": null, "Loop Max": null, OPEX_formula_ref_col: "hp", Description: "VHS-180 Hydrocyclone Separator..."
    },
    {
      Model: "LCS260", "Filter Type": "Separator", hp: 7.5, "Flow Rate": 260, "Min Recirc (gallons)": 901, "Max Recirc (gallons)": 1300, "Tonnage Min": 301, "Tonnage Max": 433, "Loop Min": null, "Loop Max": null, OPEX_formula_ref_col: "hp", Description: "VHS-260 Hydrocyclone Separator..."
    },
    {
      Model: "LCS340", "Filter Type": "Separator", hp: 7.5, "Flow Rate": 340, "Min Recirc (gallons)": 1301, "Max Recirc (gallons)": 1700, "Tonnage Min": 434, "Tonnage Max": 567, "Loop Min": null, "Loop Max": null, OPEX_formula_ref_col: "hp", Description: "VHS-340 Hydrocyclone Separator..."
    },
    {
      Model: "CTS400", "Filter Type": "Separator", hp: 15, "Flow Rate": 400, "Min Recirc (gallons)": 1701, "Max Recirc (gallons)": 2000, "Tonnage Min": 568, "Tonnage Max": 667, "Loop Min": null, "Loop Max": null, OPEX_formula_ref_col: "hp", Description: "VHS-400A Hydrocyclone Separator..."
    },
    {
      Model: "CTS700", "Filter Type": "Separator", hp: 20, "Flow Rate": 700, "Min Recirc (gallons)": 2001, "Max Recirc (gallons)": 3500, "Tonnage Min": 668, "Tonnage Max": 1167, "Loop Min": null, "Loop Max": null, OPEX_formula_ref_col: "hp", Description: "VHS-700A Hydrocyclone Separator..."
    },
    {
      Model: "CTS950", "Filter Type": "Separator", hp: 20, "Flow Rate": 950, "Min Recirc (gallons)": 3501, "Max Recirc (gallons)": 4750, "Tonnage Min": 1168, "Tonnage Max": 1583, "Loop Min": null, "Loop Max": null, OPEX_formula_ref_col: "hp", Description: "VHS-950A Hydrocyclone Separator..."
    },
    {
      Model: "CTS1600", "Filter Type": "Separator", hp: 60, "Flow Rate": 1600, "Min Recirc (gallons)": 4751, "Max Recirc (gallons)": 8000, "Tonnage Min": 1584, "Tonnage Max": 2667, "Loop Min": null, "Loop Max": null, OPEX_formula_ref_col: "hp", Description: "VHS-1600A Hydrocyclone Separator..."
    },
    {
      Model: "CTS2300", "Filter Type": "Separator", hp: 60, "Flow Rate": 2300, "Min Recirc (gallons)": 8001, "Max Recirc (gallons)": 11500, "Tonnage Min": 2668, "Tonnage Max": 3833, "Loop Min": null, "Loop Max": null, OPEX_formula_ref_col: "hp", Description: "VHS-2300A Hydrocyclone Separator..."
    },
    {
      Model: "CTS3400", "Filter Type": "Separator", hp: 100, "Flow Rate": 3400, "Min Recirc (gallons)": 11501, "Max Recirc (gallons)": 17000, "Tonnage Min": 3834, "Tonnage Max": 5667, "Loop Min": null, "Loop Max": null, OPEX_formula_ref_col: "hp", Description: "VHS-3400A Hydrocyclone Separator..."
    },
    {
      Model: "CTF200", "Filter Type": "VAF", hp: 5, "Flow Rate": 100, "Min Recirc (gallons)": 0, "Max Recirc (gallons)": 2000, "Tonnage Min": 0, "Tonnage Max": 667, "Loop Min": null, "Loop Max": null, OPEX_formula_ref_col: "hp", Description: "V200PA Self-Cleaning Screen Filter..."
    },
    {
      Model: "CTF250", "Filter Type": "VAF", hp: 7.5, "Flow Rate": 150, "Min Recirc (gallons)": 2001, "Max Recirc (gallons)": 3000, "Tonnage Min": 668, "Tonnage Max": 1000, "Loop Min": null, "Loop Max": null, OPEX_formula_ref_col: "hp", Description: "V250 Self-Cleaning Screen Filter..."
    },
    {
      Model: "CTF500", "Filter Type": "VAF", hp: 15, "Flow Rate": 300, "Min Recirc (gallons)": 3001, "Max Recirc (gallons)": 6000, "Tonnage Min": 1001, "Tonnage Max": 2000, "Loop Min": null, "Loop Max": null, OPEX_formula_ref_col: "hp", Description: "V500 Self-Cleaning Screen Filter..."
    },
    {
      Model: "CTF1000", "Filter Type": "VAF", hp: 30, "Flow Rate": 700, "Min Recirc (gallons)": 6001, "Max Recirc (gallons)": 14000, "Tonnage Min": 2001, "Tonnage Max": 4667, "Loop Min": null, "Loop Max": null, OPEX_formula_ref_col: "hp", Description: "V1000 Self-Cleaning Screen Filter..."
    },
    {
      Model: "CTF1500", "Filter Type": "VAF", hp: 50, "Flow Rate": 1100, "Min Recirc (gallons)": 14001, "Max Recirc (gallons)": 22000, "Tonnage Min": 4668, "Tonnage Max": 7333, "Loop Min": null, "Loop Max": null, OPEX_formula_ref_col: "hp", Description: "V1500 Self-Cleaning Screen Filter..."
    },
    {
      Model: "VC50", "Filter Type": "Vortisand", hp: 1.5, "Flow Rate": 50, "Min Recirc (gallons)": 0, "Max Recirc (gallons)": 5000, "Tonnage Min": 7334, "Tonnage Max": 1667, "Loop Min": 0, "Loop Max": 190000, OPEX_formula_ref_col: "hp", Description: "Vortisand VC-50 filter..."
    }, // Note: Tonnage Min/Max for VC50 seems inverted or specific. Assuming data is correct.
    {
      Model: "VC75", "Filter Type": "Vortisand", hp: 1.5, "Flow Rate": 75, "Min Recirc (gallons)": 5001, "Max Recirc (gallons)": 7500, "Tonnage Min": 1668, "Tonnage Max": 2500, "Loop Min": 190001, "Loop Max": 285000, OPEX_formula_ref_col: "hp", Description: "Vortisand VC-75 filter..."
    },
    {
      Model: "VC100", "Filter Type": "Vortisand", hp: 3, "Flow Rate": 100, "Min Recirc (gallons)": 7501, "Max Recirc (gallons)": 10000, "Tonnage Min": 2501, "Tonnage Max": 3333, "Loop Min": 285001, "Loop Max": 380000, OPEX_formula_ref_col: "hp", Description: "Vortisand VC-100 filter..."
    },
    {
      Model: "VC140", "Filter Type": "Vortisand", hp: 3, "Flow Rate": 140, "Min Recirc (gallons)": 10001, "Max Recirc (gallons)": 14000, "Tonnage Min": 3334, "Tonnage Max": 4667, "Loop Min": 380001, "Loop Max": 532000, OPEX_formula_ref_col: "hp", Description: "Vortisand VC-140 filter..."
    },
    {
      Model: "VC200", "Filter Type": "Vortisand", hp: 5, "Flow Rate": 200, "Min Recirc (gallons)": 14001, "Max Recirc (gallons)": 20000, "Tonnage Min": 4668, "Tonnage Max": 6667, "Loop Min": 532001, "Loop Max": 760000, OPEX_formula_ref_col: "hp", Description: "Vortisand VC-200 filter..."
    },
    {
      Model: "VC280", "Filter Type": "Vortisand", hp: 7.5, "Flow Rate": 280, "Min Recirc (gallons)": 20001, "Max Recirc (gallons)": 28000, "Tonnage Min": 6668, "Tonnage Max": 9333, "Loop Min": 760001, "Loop Max": 1064000, OPEX_formula_ref_col: "hp", Description: "Vortisand VC-280 filter..."
    },
    {
      Model: "VC350", "Filter Type": "Vortisand", hp: 10, "Flow Rate": 350, "Min Recirc (gallons)": 28001, "Max Recirc (gallons)": 35000, "Tonnage Min": 9334, "Tonnage Max": 11667, "Loop Min": 1064001, "Loop Max": 1330000, OPEX_formula_ref_col: "hp", Description: "Vortisand VC-350 filter..."
    },
    {
      Model: "VC600", "Filter Type": "Vortisand", hp: 15, "Flow Rate": 600, "Min Recirc (gallons)": 35001, "Max Recirc (gallons)": 60000, "Tonnage Min": 11668, "Tonnage Max": 20000, "Loop Min": 1330001, "Loop Max": 2280000, OPEX_formula_ref_col: "hp", Description: "Vortisand VC-600 filter..."
    }
  ];
  
  // Manually parse the numeric strings from the provided CSV snapshot
  // (This would be part of the data transformation if reading from CSV directly)
  // For demonstration, I've pre-parsed them in the structure above.
  // Example for one entry that had string numbers:
  // LCS260,Separator,7.5,260,"901","1,300",301,433,,,(=C4*.7457*8760*$PKW)
  // would become:
  // { Model: "LCS260", "Filter Type": "Separator", hp: 7.5, "Flow Rate": 260, 
  //   "Min Recirc (gallons)": 901, "Max Recirc (gallons)": 1300, 
  //   "Tonnage Min": 301, "Tonnage Max": 433, /* ... */ }
  
  // For simplicity, the Description field in the data above is truncated.
  // You should put the full description from your CSV.
  
  export const calculateOpex = (hp: number, pkw: number): number => {
    if (isNaN(hp) || isNaN(pkw) || pkw <= 0) return 0;
    return hp * 0.7457 * 8760 * pkw;
  };
  
  export const h2oQualityMap: Record<Filter['Filter Type'], string> = {
    Separator: "Good (70 Micron / High SG)",
    VAF: "Better (25 Micron / All)",
    Vortisand: "Best (0.5 Micron / All)",
  };
  
  export const filterImageMap: Record<Filter['Filter Type'], string> = {
    Separator: "/seperator_image.jpg", // Replace with actual image filenames
    VAF: "/vaf_image.jpg",
    Vortisand: "/vortisand_image.jpg",
  };
  
  // Note: The actual image filenames are:
  // Separator: from the unnamed image (let's call it separator_image.png)
  // VAF: from V2000H_image.png (let's call it vaf_image.png)
  // Vortisand: from the complex skid image (let's call it vortisand_image.png)
  // Place these in your `public` folder.