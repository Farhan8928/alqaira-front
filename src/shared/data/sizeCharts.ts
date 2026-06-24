/**
 * ALQAIRA size charts (inches) — from the official measurement book.
 * Flexible model: each chart defines its own columns, rows and a "finder"
 * (recommend by chest for adults, by age for kids). Used by the Size Guide.
 */
export type Col = { key: string; label: string };
export type Row = Record<string, number | string>;
export type Finder = {
  by: "chest" | "age";
  label: string;
  hint: string;
  placeholder: string;
  unit: string;
};
export type Chart = {
  id: string;
  label: string;
  columns: Col[];
  rows: Row[];
  sizeKey: string; // which column holds the size label
  finder: Finder;
};

const ADULT_COLS: Col[] = [
  { key: "size", label: "Size" },
  { key: "length", label: "Length" },
  { key: "chest", label: "Chest" },
  { key: "waist", label: "Waist" },
  { key: "shoulder", label: "Shoulder" },
  { key: "sleeves", label: "Sleeves" },
];

/** Men's Thobe / Jubba */
export const THOBE: Chart = {
  id: "thobe",
  label: "Men's Thobe Size",
  sizeKey: "size",
  finder: {
    by: "chest",
    label: "Your chest measurement",
    hint: "Measure around the fullest part of your chest, tape level.",
    placeholder: "e.g. 40",
    unit: "inches",
  },
  columns: ADULT_COLS,
  rows: [
    { size: "S", length: 54, chest: 36, waist: 34, shoulder: 16, sleeves: 24 },
    { size: "M", length: 56, chest: 38, waist: 36, shoulder: 17, sleeves: 24.5 },
    { size: "L", length: 58, chest: 40, waist: 38, shoulder: 18, sleeves: 25 },
    { size: "XL", length: 60, chest: 42, waist: 40, shoulder: 19, sleeves: 25.5 },
    { size: "2XL", length: 60, chest: 44, waist: 42, shoulder: 20, sleeves: 26 },
    { size: "3XL", length: 62, chest: 46, waist: 44, shoulder: 21, sleeves: 26.5 },
  ],
};

/** Men's Kurta Pajama */
export const KURTA: Chart = {
  id: "kurta",
  label: "Men's Kurta Size",
  sizeKey: "size",
  finder: {
    by: "chest",
    label: "Your chest measurement",
    hint: "Measure around the fullest part of your chest, tape level.",
    placeholder: "e.g. 40",
    unit: "inches",
  },
  columns: ADULT_COLS,
  rows: [
    { size: "S", length: 40, chest: 36, waist: 34, shoulder: 17, sleeves: 23.5 },
    { size: "M", length: 41, chest: 38, waist: 36, shoulder: 18, sleeves: 24 },
    { size: "L", length: 42, chest: 40, waist: 38, shoulder: 19, sleeves: 24.5 },
    { size: "XL", length: 43, chest: 42, waist: 40, shoulder: 19.5, sleeves: 25 },
    { size: "2XL", length: 44, chest: 44, waist: 42, shoulder: 20, sleeves: 25.5 },
    { size: "3XL", length: 45, chest: 46, waist: 44, shoulder: 20.5, sleeves: 26 },
  ],
};

/** Kids / Boys Thobe (by age) */
export const KIDS_THOBE: Chart = {
  id: "kids-thobe",
  label: "Boys Thobe Size",
  sizeKey: "size",
  finder: {
    by: "age",
    label: "Your child's age",
    hint: "Pick by age — choose one size up if your child is taller than average.",
    placeholder: "e.g. 7",
    unit: "years",
  },
  columns: [
    { key: "size", label: "Size" },
    { key: "age", label: "Age" },
    { key: "length", label: "Length" },
    { key: "shoulder", label: "Shoulder" },
    { key: "chest", label: "Chest" },
    { key: "sleeves", label: "Sleeves" },
    { key: "bottom", label: "Bottom" },
  ],
  rows: [
    {
      size: "20",
      age: "12 Months",
      length: 20,
      shoulder: 9,
      chest: 12,
      sleeves: 10,
      bottom: 15.5,
      _age: 1,
    },
    {
      size: "22",
      age: "18 Months",
      length: 22,
      shoulder: 9.5,
      chest: 12.5,
      sleeves: 10.5,
      bottom: 15.5,
      _age: 1.5,
    },
    {
      size: "24",
      age: "2 Years",
      length: 24,
      shoulder: 10,
      chest: 13,
      sleeves: 11,
      bottom: 16,
      _age: 2,
    },
    {
      size: "26",
      age: "3 Years",
      length: 26,
      shoulder: 10.5,
      chest: 13.5,
      sleeves: 11.5,
      bottom: 17,
      _age: 3,
    },
    {
      size: "28",
      age: "4 Years",
      length: 28,
      shoulder: 11,
      chest: 14,
      sleeves: 12,
      bottom: 18,
      _age: 4,
    },
    {
      size: "30",
      age: "5 Years",
      length: 30,
      shoulder: 11.5,
      chest: 14,
      sleeves: 13,
      bottom: 19,
      _age: 5,
    },
    {
      size: "32",
      age: "6 Years",
      length: 32,
      shoulder: 12,
      chest: 14.5,
      sleeves: 14,
      bottom: 20,
      _age: 6,
    },
    {
      size: "34",
      age: "7 Years",
      length: 34,
      shoulder: 12.5,
      chest: 15.5,
      sleeves: 15,
      bottom: 21,
      _age: 7,
    },
    {
      size: "36",
      age: "8 Years",
      length: 36,
      shoulder: 13,
      chest: 16,
      sleeves: 16,
      bottom: 22,
      _age: 8,
    },
    {
      size: "38",
      age: "9 Years",
      length: 38,
      shoulder: 13.5,
      chest: 16.5,
      sleeves: 17,
      bottom: 23,
      _age: 9,
    },
    {
      size: "40",
      age: "10 Years",
      length: 40,
      shoulder: 13.5,
      chest: 17,
      sleeves: 18,
      bottom: 24,
      _age: 10,
    },
    {
      size: "42",
      age: "11 Years",
      length: 42,
      shoulder: 14,
      chest: 17.5,
      sleeves: 18.5,
      bottom: 25,
      _age: 11,
    },
    {
      size: "44",
      age: "12 Years",
      length: 44,
      shoulder: 14.5,
      chest: 18,
      sleeves: 19.5,
      bottom: 26,
      _age: 12,
    },
    {
      size: "46",
      age: "13 Years",
      length: 46,
      shoulder: 15,
      chest: 19,
      sleeves: 20.5,
      bottom: 26.5,
      _age: 13,
    },
    {
      size: "48",
      age: "14 Years",
      length: 48,
      shoulder: 16,
      chest: 20,
      sleeves: 21.5,
      bottom: 27,
      _age: 14,
    },
    {
      size: "50",
      age: "15 Years",
      length: 50,
      shoulder: 16.5,
      chest: 21,
      sleeves: 22,
      bottom: 28,
      _age: 15,
    },
  ],
};

/** Kids / Boys Kurta (by age) */
export const BOYS_KURTA: Chart = {
  id: "kids-kurta",
  label: "Boys Kurta Size",
  sizeKey: "age",
  finder: {
    by: "age",
    label: "Your child's age",
    hint: "Pick by age — choose one size up if your child is taller than average.",
    placeholder: "e.g. 7",
    unit: "years",
  },
  columns: [
    { key: "age", label: "Age" },
    { key: "length", label: "Length" },
    { key: "chest", label: "Chest" },
    { key: "shoulder", label: "Shoulder" },
    { key: "sleeves", label: "Sleeves" },
    { key: "salwar", label: "Salwar" },
  ],
  rows: [
    { age: "1 yr", length: 16, chest: 11.5, shoulder: 10.5, sleeves: 10, salwar: 16, _age: 1 },
    { age: "2 yr", length: 18, chest: 12, shoulder: 11, sleeves: 10.5, salwar: 18, _age: 2 },
    { age: "3 yr", length: 20, chest: 12.5, shoulder: 11.5, sleeves: 11.5, salwar: 20, _age: 3 },
    { age: "4 yr", length: 22, chest: 13, shoulder: 11.5, sleeves: 12.5, salwar: 22, _age: 4 },
    { age: "5 yr", length: 24, chest: 13.5, shoulder: 12, sleeves: 14, salwar: 24, _age: 5 },
    { age: "6 yr", length: 26, chest: 14, shoulder: 12.5, sleeves: 16, salwar: 26, _age: 6 },
    { age: "7 yr", length: 28, chest: 14.5, shoulder: 13, sleeves: 17, salwar: 28, _age: 7 },
    { age: "8 yr", length: 30, chest: 15, shoulder: 14, sleeves: 18, salwar: 30, _age: 8 },
    { age: "9 yr", length: 31, chest: 15.5, shoulder: 14.5, sleeves: 18.5, salwar: 31, _age: 9 },
    { age: "10 yr", length: 32, chest: 16, shoulder: 15, sleeves: 19, salwar: 32, _age: 10 },
    { age: "11 yr", length: 33, chest: 16.5, shoulder: 15.5, sleeves: 19.5, salwar: 33, _age: 11 },
    { age: "12 yr", length: 34, chest: 17, shoulder: 16, sleeves: 20, salwar: 34, _age: 12 },
    { age: "13 yr", length: 35, chest: 17.5, shoulder: 16, sleeves: 20.5, salwar: 35, _age: 13 },
    { age: "14 yr", length: 36, chest: 18, shoulder: 16, sleeves: 21, salwar: 36, _age: 14 },
    { age: "15 yr", length: 37, chest: 18.5, shoulder: 16.5, sleeves: 21.5, salwar: 37, _age: 15 },
    { age: "16 yr", length: 38, chest: 19, shoulder: 16.5, sleeves: 22, salwar: 38, _age: 16 },
  ],
};

/** All charts the admin can edit (order shown in the Settings page). */
export const EDITABLE_CHARTS: Chart[] = [THOBE, KURTA, KIDS_THOBE, BOYS_KURTA];

/** Built-in default rows keyed by chart id (fallback when settings are empty). */
export const DEFAULT_CHART_ROWS: Record<string, Row[]> = Object.fromEntries(
  EDITABLE_CHARTS.map((c) => [c.id, c.rows]),
);

/** Pick the right chart for a product (null = no chart, e.g. women — hide guide). */
export function chartFor(section?: string, categoryName?: string): Chart | null {
  const n = (categoryName || "").toLowerCase();
  if (n.includes("jacket")) return null; // jackets have no measurement chart
  const isKurta = n.includes("kurta") || n.includes("pathani") || n.includes("pajama");
  if (section === "men") return isKurta ? KURTA : THOBE;
  if (section === "kids") return isKurta ? BOYS_KURTA : KIDS_THOBE;
  return null;
}

/** Recommend a row from the finder value (chest in inches, or age in years). */
export function recommend(chart: Chart, value: number): Row | null {
  if (!value || Number.isNaN(value)) return null;
  if (chart.finder.by === "chest") {
    // Charts are "as per body dimension": match the body chest directly to the
    // smallest size whose chest is >= the measurement (no extra ease added).
    return chart.rows.find((r) => Number(r.chest) >= value) ?? chart.rows[chart.rows.length - 1];
  }
  // by age — nearest _age
  let best: Row | null = null;
  let diff = Infinity;
  for (const r of chart.rows) {
    const d = Math.abs(Number(r._age) - value);
    if (d < diff) {
      diff = d;
      best = r;
    }
  }
  return best;
}
