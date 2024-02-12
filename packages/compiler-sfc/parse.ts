import { type SourceLocation } from "chibivue";

export interface SFCDescriptor {
  id: string;
  filename: string;
  source: string;
  template: SFCTemplateBlock | null;
  script: SFCScriptBlock | null;
  styles: SFCStyleBlock[];
}

export interface SFCBlock {
  type: string;
  content: string;
  location: SourceLocation;
}

export interface SFCTemplateBlock extends SFCBlock {
  type: "template";
}

export interface SFCScriptBlock extends SFCBlock {
  type: "script";
}

export interface SFCStyleBlock extends SFCBlock {
  type: "style";
}
