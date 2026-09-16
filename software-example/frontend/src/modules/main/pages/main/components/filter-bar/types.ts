export interface FilterBarProps {
  onFilterChange: (
    searchQuery: string | undefined,
    useSemanticSearch: boolean,
    semanticLimit: number | undefined,
    denseWeight: number,
    sparseWeight: number,
    textWeight: number
  ) => void;
}

export interface WeightInputsProps {
  disabled: boolean;
}
