import React from 'react';
import { DataStreamBackground } from './DataStreamBackground';
import { MatrixCodeBackground } from './MatrixCodeBackground';
import { VaultGeometryBackground } from './VaultGeometryBackground';
import { GalaxyCapitalBackground } from './GalaxyCapitalBackground';
import { BlueprintSchematicBackground } from './BlueprintSchematicBackground';

interface ContextAwareBackgroundProps {
  pageId: string;
}

export const ContextAwareBackground: React.FC<ContextAwareBackgroundProps> = ({ pageId }) => {
  switch (pageId) {
    // 2. Featured Micro Tools / Fee Estimator: Data Packets, Telemetry, and Speed
    case 'utility-tools':
    case 'gas-calculator':
      return <DataStreamBackground />;

    // 3. Scripts Vault: Matrix Binary/Code Rain with Brackets & Terminal Symbols
    case 'developer-scripts':
      return <MatrixCodeBackground />;

    // 4. Pricing & Pro / Digital Vault (Downloads): Glowing Vault Lock Geometry & Asset Flows
    case 'store':
    case 'vault':
      return <VaultGeometryBackground />;

    // 5. Backers Hub / Investors & IP: Galaxy Swirling Capital Flows & Connected Growth Nodes
    case 'backers-hub':
    case 'investors-hub':
      return <GalaxyCapitalBackground />;

    // 6. Docs & API / About & FAQ / Trust & Legal: Calm Blueprint Schematic & Information Flows
    case 'dev-docs':
    case 'about':
    case 'trust-legal-hub':
    default:
      return <BlueprintSchematicBackground />;
  }
};
