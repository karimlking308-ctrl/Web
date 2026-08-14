import React from 'react';

// Image Tools
import { ImageResizerTool } from './image/ImageResizerTool';
import { ImageCompressorTool } from './image/ImageCompressorTool';
import { ImageConverterTool } from './image/ImageConverterTool';
import { ImageCropperTool } from './image/ImageCropperTool';
import { ImageRotatorTool } from './image/ImageRotatorTool';

// PDF Tools
import { PdfToJpgTool } from './pdf/PdfToJpgTool';
import { JpgToPdfTool } from './pdf/JpgToPdfTool';
import { MergePdfTool } from './pdf/MergePdfTool';
import { SplitPdfTool } from './pdf/SplitPdfTool';

// Code Tools
import { JsonFormatterTool } from './code/JsonFormatterTool';
import { JsonValidatorTool } from './code/JsonValidatorTool';
import { JsonMinifierTool } from './code/JsonMinifierTool';
import { Base64Tool } from './code/Base64Tool';
import { UrlEncoderTool } from './code/UrlEncoderTool';
import { UuidGeneratorTool } from './code/UuidGeneratorTool';
import { HtmlFormatterTool } from './code/HtmlFormatterTool';
import { CssFormatterTool } from './code/CssFormatterTool';
import { JavascriptFormatterTool } from './code/JavascriptFormatterTool';
import { SqlFormatterTool } from './code/SqlFormatterTool';
import { QrCodeGeneratorTool } from './code/QrCodeGeneratorTool';

// Text Tools
import { WordCounterTool } from './text/WordCounterTool';
import { CharacterCounterTool } from './text/CharacterCounterTool';
import { TextCaseConverterTool } from './text/TextCaseConverterTool';
import { RemoveDuplicateLinesTool } from './text/RemoveDuplicateLinesTool';
import { TextCleanerTool } from './text/TextCleanerTool';
import { TextSorterTool } from './text/TextSorterTool';
import { FindAndReplaceTool } from './text/FindAndReplaceTool';

// Calculators
import { PercentageCalculatorTool } from './calculators/PercentageCalculatorTool';
import { AgeCalculatorTool } from './calculators/AgeCalculatorTool';
import { DiscountCalculatorTool } from './calculators/DiscountCalculatorTool';
import { ProfitLossCalculatorTool } from './calculators/ProfitLossCalculatorTool';
import { TipCalculatorTool } from './calculators/TipCalculatorTool';
import { DateDifferenceCalculatorTool } from './calculators/DateDifferenceCalculatorTool';

// Converters
import { LengthConverterTool } from './converters/LengthConverterTool';
import { WeightConverterTool } from './converters/WeightConverterTool';
import { TemperatureConverterTool } from './converters/TemperatureConverterTool';
import { TimeConverterTool } from './converters/TimeConverterTool';
import { DataUnitsConverterTool } from './converters/DataUnitsConverterTool';
import { NumberBaseConverterTool } from './converters/NumberBaseConverterTool';

interface ToolRendererProps {
  toolId: string;
}

export const ToolRenderer: React.FC<ToolRendererProps> = ({ toolId }) => {
  switch (toolId) {
    // Image Tools
    case 'image-resizer':
      return <ImageResizerTool />;
    case 'image-compressor':
      return <ImageCompressorTool />;
    case 'image-converter':
      return <ImageConverterTool />;
    case 'image-cropper':
      return <ImageCropperTool />;
    case 'image-rotator':
      return <ImageRotatorTool />;

    // PDF Tools
    case 'pdf-to-jpg':
      return <PdfToJpgTool />;
    case 'jpg-to-pdf':
      return <JpgToPdfTool />;
    case 'merge-pdf':
      return <MergePdfTool />;
    case 'split-pdf':
      return <SplitPdfTool />;

    // Code Tools
    case 'json-formatter':
      return <JsonFormatterTool />;
    case 'json-validator':
      return <JsonValidatorTool />;
    case 'json-minifier':
      return <JsonMinifierTool />;
    case 'base64-encoder-decoder':
      return <Base64Tool />;
    case 'url-encoder-decoder':
      return <UrlEncoderTool />;
    case 'uuid-generator':
      return <UuidGeneratorTool />;
    case 'html-formatter':
      return <HtmlFormatterTool />;
    case 'css-formatter':
      return <CssFormatterTool />;
    case 'javascript-formatter':
      return <JavascriptFormatterTool />;
    case 'sql-formatter':
      return <SqlFormatterTool />;
    case 'qr-code-generator':
      return <QrCodeGeneratorTool />;

    // Text Tools
    case 'word-counter':
      return <WordCounterTool />;
    case 'character-counter':
      return <CharacterCounterTool />;
    case 'text-case-converter':
      return <TextCaseConverterTool />;
    case 'remove-duplicate-lines':
      return <RemoveDuplicateLinesTool />;
    case 'text-cleaner':
      return <TextCleanerTool />;
    case 'text-sorter':
      return <TextSorterTool />;
    case 'find-and-replace':
      return <FindAndReplaceTool />;

    // Calculators
    case 'percentage-calculator':
      return <PercentageCalculatorTool />;
    case 'age-calculator':
      return <AgeCalculatorTool />;
    case 'discount-calculator':
      return <DiscountCalculatorTool />;
    case 'profit-loss-calculator':
      return <ProfitLossCalculatorTool />;
    case 'tip-calculator':
      return <TipCalculatorTool />;
    case 'date-difference-calculator':
      return <DateDifferenceCalculatorTool />;

    // Converters
    case 'length-converter':
      return <LengthConverterTool />;
    case 'weight-converter':
      return <WeightConverterTool />;
    case 'temperature-converter':
      return <TemperatureConverterTool />;
    case 'time-converter':
      return <TimeConverterTool />;
    case 'data-units-converter':
      return <DataUnitsConverterTool />;
    case 'number-base-converter':
      return <NumberBaseConverterTool />;

    default:
      return (
        <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <p className="text-slate-600 dark:text-slate-400">Tool component not found for ID: {toolId}</p>
        </div>
      );
  }
};
