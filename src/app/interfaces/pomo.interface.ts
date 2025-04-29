export interface Data {
  identifiers: Name[];
}

export interface Name {
  name: string
}

export interface SlideToggle {
  id: number,
  name: string,
  checked: boolean
}

export interface SearchFilter {
  colorEnabled: boolean,
  colorSearchFilter: Map<string, colorSearchFilter>,
  // colorIdentityEnabled: boolean,
  // colorIdentitySearchFilter: Map<string, boolean>,
}

export interface colorSearchFilter {
  colorCode: string,
  enabled: boolean,
}

export interface manaSearchFilter {
}
