/**
 * Reown AppKit Type Definitions
 * Custom types for Stacks blockchain integration
 */

declare module '@reown/appkit' {
  export interface AppKitOptions {
    projectId: string;
    chains: any[];
    metadata: {
      name: string;
      description: string;
      url: string;
      icons: string[];
    };
  }
}

declare module '@reown/appkit-adapter-stacks' {
  export function stacksAdapter(config: any): any;
}
