import { Tool, ToolCategory } from '../types';

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'cat-conversion',
    slug: 'conversion',
    name: 'PDF Conversion',
    description: 'Transform documents between PDF, Word, JPG, PNG and other formats without losing formatting.',
    icon: 'RefreshCw',
    displayOrder: 1,
  },
  {
    id: 'cat-management',
    slug: 'management',
    name: 'PDF Management',
    description: 'Merge, split, compress, reorder, rotate and organize multiple PDF files effortlessly.',
    icon: 'Layers',
    displayOrder: 2,
  },
  {
    id: 'cat-content',
    slug: 'content',
    name: 'PDF Content & AI',
    description: 'Summarize, chat, translate, OCR and extract structured text from complex documents.',
    icon: 'Sparkles',
    displayOrder: 3,
  },
  {
    id: 'cat-image',
    slug: 'image',
    name: 'Image Utilities',
    description: 'Compress, resize, and convert image files to match document publishing requirements.',
    icon: 'Image',
    displayOrder: 4,
  },
];

export const TOOLS_DATA: Tool[] = [
  // 1. PDF to Word
  {
    id: 'tool-pdf-to-word',
    slug: 'pdf-to-word',
    name: 'PDF to Word',
    category: 'conversion',
    shortDescription: 'Convert PDF documents into editable Microsoft Word (.docx) files accurately.',
    h1: 'PDF to Word Converter - Convert PDF to Word Online',
    seoTitle: 'PDF to Word Converter - Convert PDF to Editable Word Online | PDFNova',
    seoDescription: 'Convert PDF documents into editable Microsoft Word (.docx) files online. Preserve tables, fonts, and layouts cleanly. 100% free and secure.',
    keywords: ['PDF to Word converter', 'convert PDF to editable Word', 'PDF to DOCX', 'convert PDF to Word online'],
    icon: 'FileText',
    isActive: true,
    maxFileSizeMb: 50,
    allowedMimeTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    options: [
      {
        id: 'ocrEngine',
        label: 'Extraction Mode',
        type: 'select',
        defaultValue: 'standard',
        options: [
          { label: 'Standard (Selectable Text & Vector Graphics)', value: 'standard' },
          { label: 'Deep OCR (Scanned Invoices & Handwritten)', value: 'ocr' },
        ],
      },
      {
        id: 'maintainLayout',
        label: 'Preserve Precise Layout',
        type: 'toggle',
        defaultValue: true,
      },
    ],
    howItWorks: [
      { step: 1, title: 'Upload Your PDF', description: 'Drag and drop or select the PDF file from your device.' },
      { step: 2, title: 'Intelligent Parsing', description: 'Our engine extracts text blocks, tables, fonts, and layout geometry.' },
      { step: 3, title: 'Download DOCX', description: 'Save your editable Word document ready for editing in Word, Docs, or Pages.' },
    ],
    features: [
      'Preserves fonts, bullet points, headers, footers, and complex multi-column tables',
      'High-fidelity vector graphics and embedded image preservation',
      'Batch conversion architecture ready for large enterprise documents',
      'No registration or watermark added to your output document',
    ],
    faqs: [
      {
        question: 'Will my converted Word document be fully editable?',
        answer: 'Yes! The resulting .docx file contains native paragraphs, headings, tables, and images that you can edit using Microsoft Word, Google Docs, Apple Pages, or LibreOffice.',
      },
      {
        question: 'Are scanned or photo PDFs supported?',
        answer: 'Yes, when deep OCR is enabled, our optical character recognition engine analyzes pixel data to turn scanned paperwork into editable text.',
      },
      {
        question: 'Is my document private and safe?',
        answer: 'All file processing occurs in isolated runtime containers. Uploaded files are held strictly temporarily and purged following job completion.',
      },
    ],
    relatedToolSlugs: ['word-to-pdf', 'pdf-to-text', 'ocr-pdf', 'compress-pdf', 'merge-pdf'],
    longContent: {
      overview: 'Converting a PDF to an editable Word document often results in broken tables, misaligned margins, and messy text boxes. PDFNova utilizes advanced document layout analysis to rebuild native DOCX primitives, ensuring headings remain headings, bulleted lists remain lists, and tables stay clean.',
      useCases: [
        { audience: 'Business & Finance', description: 'Quickly modify statements, quarterly reports, proposals, and supplier agreements without having to retype them.' },
        { audience: 'Students & Educators', description: 'Turn research papers, syllabi, and lecture slide PDFs into editable study notes and assignments.' },
        { audience: 'Legal & HR', description: 'Update terms, employee handbooks, and standard operating procedures while maintaining document structure.' },
      ],
      securityNotice: 'Documents uploaded to PDFNova are encrypted in transit via TLS 1.3 and processed in isolated worker containers. Files are not stored permanently.',
    },
  },

  // 2. Word to PDF
  {
    id: 'tool-word-to-pdf',
    slug: 'word-to-pdf',
    name: 'Word to PDF',
    category: 'conversion',
    shortDescription: 'Convert Microsoft Word (.docx, .doc) files into clean, standardized PDF documents.',
    h1: 'Word to PDF Converter - Convert Word Document to PDF Online',
    seoTitle: 'Word to PDF Converter - Convert Word Document to PDF Online | PDFNova',
    seoDescription: 'Free Word to PDF converter online. Convert Word documents (DOCX and DOC) to high quality PDF with perfect layout, fonts, and hyperlinking preserved.',
    keywords: ['Word to PDF converter', 'DOCX to PDF', 'convert Word to PDF', 'Word document to PDF'],
    icon: 'FileCode',
    isActive: true,
    maxFileSizeMb: 50,
    allowedMimeTypes: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ],
    allowedExtensions: ['.docx', '.doc'],
    howItWorks: [
      { step: 1, title: 'Choose Word File', description: 'Select any .docx or .doc file from your computer or phone.' },
      { step: 2, title: 'Serverless Render', description: 'The rendering engine compiles typography, margins, and page breaks.' },
      { step: 3, title: 'Download Clean PDF', description: 'Download a universal, standardized PDF that renders identically on any device.' },
    ],
    features: [
      'Universal layout preservation across Windows, macOS, iOS, and Android',
      'Automatic embedded font subsetting for crisp vector printing',
      'Preserves active hyperlinks, bookmarks, and document metadata',
      'Zero distortion of embedded charts, graphs, and smart art',
    ],
    faqs: [
      {
        question: 'Does this converter support older .doc files?',
        answer: 'Yes, both modern Microsoft Word (.docx) and legacy (.doc) binary formats are fully supported.',
      },
      {
        question: 'Will clickable hyperlinks remain functional?',
        answer: 'Yes, web links, email links, and internal document bookmarks are converted into native PDF annotation links.',
      },
    ],
    relatedToolSlugs: ['pdf-to-word', 'compress-pdf', 'merge-pdf', 'pdf-to-jpg'],
    longContent: {
      overview: 'Sharing Word files directly frequently leads to font substitution errors, accidental margin alterations, and misaligned images depending on which software the recipient uses. Converting to PDF standardizes your document for professional distribution, client contracts, and high-resolution printing.',
      useCases: [
        { audience: 'Job Seekers', description: 'Lock in your resume and cover letter formatting so hiring managers see exactly what you designed.' },
        { audience: 'Agencies & Freelancers', description: 'Deliver pristine client quotes, proposals, and invoices that cannot be accidentally modified.' },
        { audience: 'Academic Authors', description: 'Publish theses and research drafts compliant with university submission standards.' },
      ],
      securityNotice: 'Your Word files are processed securely in volatile memory containers and are never used to train machine learning models.',
    },
  },

  // 3. JPG to PDF
  {
    id: 'tool-jpg-to-pdf',
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    category: 'conversion',
    shortDescription: 'Combine JPG and JPEG photos into a clean, multi-page or single-page PDF document.',
    h1: 'Convert JPG to PDF Online - Image to PDF Converter',
    seoTitle: 'JPG to PDF Converter - Convert JPG Images to PDF Online | PDFNova',
    seoDescription: 'Convert JPG to PDF online for free. Combine JPG, JPEG, PNG, and WebP images to PDF with custom orientation, margins, and paper sizes.',
    keywords: ['JPG to PDF', 'image to PDF', 'convert JPG to PDF', 'JPG images to PDF'],
    icon: 'Image',
    isActive: true,
    maxFileSizeMb: 60,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    multiFile: true,
    clientExecutable: true,
    options: [
      {
        id: 'orientation',
        label: 'Page Orientation',
        type: 'select',
        defaultValue: 'portrait',
        options: [
          { label: 'Auto (Fit Image Aspect Ratio)', value: 'auto' },
          { label: 'Portrait', value: 'portrait' },
          { label: 'Landscape', value: 'landscape' },
        ],
      },
      {
        id: 'pageSize',
        label: 'Page Size',
        type: 'select',
        defaultValue: 'A4',
        options: [
          { label: 'A4 (210 × 297 mm)', value: 'A4' },
          { label: 'US Letter (8.5 × 11 in)', value: 'LETTER' },
          { label: 'Fit to Image Dimensions', value: 'FIT' },
        ],
      },
    ],
    howItWorks: [
      { step: 1, title: 'Upload Image(s)', description: 'Select one or multiple JPG, PNG, or WebP photos.' },
      { step: 2, title: 'Arrange & Configure', description: 'Reorder images, select page orientation, and choose paper sizes.' },
      { step: 3, title: 'Generate PDF', description: 'Instantly download your compiled multi-page PDF document.' },
    ],
    features: [
      'Multi-image batch support: stitch unlimited photos into a single PDF',
      'Client-side processing: blazing fast conversions right in your browser',
      'Configurable margins, page sizes (A4, Letter), and orientations',
      'Automatic image optimization to keep PDF file sizes manageable',
    ],
    faqs: [
      {
        question: 'Can I combine multiple pictures into one PDF?',
        answer: 'Yes! Simply select multiple images or drag them into the upload box. You can easily drag to reorder them before creating the PDF.',
      },
      {
        question: 'Does this tool compress or reduce image quality?',
        answer: 'We maintain maximum visual fidelity by default, placing the full-resolution image streams directly into the PDF container.',
      },
    ],
    relatedToolSlugs: ['pdf-to-jpg', 'image-compressor', 'image-resizer', 'merge-pdf'],
    longContent: {
      overview: 'Whether you are submitting receipts for expense reimbursement, compiling book scans for study, or submitting identification documents for verification, our JPG to PDF tool quickly organizes visual assets into a universally accepted document format.',
      useCases: [
        { audience: 'Tax & Accounting', description: 'Assemble photo receipts, bank slips, and tax forms into a single consolidated audit trail.' },
        { audience: 'Real Estate & Field Agents', description: 'Turn property photos, inspection records, and work orders into client-ready PDFs directly from your phone.' },
        { audience: 'Students', description: 'Merge photos of whiteboard notes and homework sheets into one clean PDF assignment.' },
      ],
      securityNotice: 'Client-side processing handles your images locally in your browser memory for maximum privacy.',
    },
  },

  // 4. PDF to JPG
  {
    id: 'tool-pdf-to-jpg',
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    category: 'conversion',
    shortDescription: 'Extract PDF pages into high-resolution JPG or PNG images with high clarity.',
    h1: 'Convert PDF to JPG Online - PDF to Image Converter',
    seoTitle: 'PDF to JPG - Convert PDF Pages to Images & PDF to JPEG | PDFNova',
    seoDescription: 'Convert PDF to JPG online in high resolution. Convert PDF pages to images or download a ZIP archive with 300 DPI clarity. Fast, free, and private.',
    keywords: ['PDF to JPG', 'convert PDF pages to images', 'PDF to JPEG', 'convert PDF to image'],
    icon: 'ImageIcon',
    isActive: true,
    maxFileSizeMb: 50,
    allowedMimeTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    options: [
      {
        id: 'dpiQuality',
        label: 'Image Resolution (DPI)',
        type: 'select',
        defaultValue: '150',
        options: [
          { label: 'Standard Web (150 DPI)', value: '150' },
          { label: 'High Print Quality (300 DPI)', value: '300' },
        ],
      },
    ],
    howItWorks: [
      { step: 1, title: 'Upload PDF', description: 'Select the PDF document you want to extract images from.' },
      { step: 2, title: 'Rasterization', description: 'Each page is rendered onto a high-definition canvas.' },
      { step: 3, title: 'Download Images', description: 'Download your high-resolution JPG images individually or as a ZIP.' },
    ],
    features: [
      'True 300 DPI vector rasterization for sharp typography and artwork',
      'Download all pages at once in a convenient compressed archive',
      'Fast client & edge rendering pipeline',
      'Works with password-protected or complex vector PDFs',
    ],
    faqs: [
      {
        question: 'What is the image quality of the converted JPGs?',
        answer: 'You can choose between 150 DPI for rapid web sharing and 300 DPI for ultra-crisp print quality representation.',
      },
    ],
    relatedToolSlugs: ['jpg-to-pdf', 'pdf-to-word', 'split-pdf', 'image-compressor'],
    longContent: {
      overview: 'Transform entire PDF presentations, brochures, flyers, and diagrams into standard web-compatible JPG images for easy posting to social media, integration into presentations, or website display.',
      useCases: [
        { audience: 'Designers & Marketers', description: 'Turn promotional brochures and banners into high-res images for social media and email newsletters.' },
        { audience: 'Presentation Creators', description: 'Easily insert specific PDF page charts into PowerPoint, Keynote, or Google Slides.' },
      ],
      securityNotice: 'All document streams are processed securely with automatic cleanup.',
    },
  },

  // 5. Merge PDF
  {
    id: 'tool-merge-pdf',
    slug: 'merge-pdf',
    name: 'Merge PDF',
    category: 'management',
    shortDescription: 'Combine multiple PDF files into one consolidated, perfectly ordered document.',
    h1: 'Merge PDF Files Online - Combine Multiple PDFs',
    seoTitle: 'Merge PDF Files - Combine PDFs & Merge PDF Documents Online | PDFNova',
    seoDescription: 'Merge PDF files online for free. Combine PDFs online into one consolidated document in your preferred page order. Fast, private, and secure.',
    keywords: ['merge PDF files', 'combine PDFs online', 'merge PDF documents', 'combine PDF files'],
    icon: 'Combine',
    isActive: true,
    maxFileSizeMb: 100,
    allowedMimeTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    multiFile: true,
    clientExecutable: true,
    howItWorks: [
      { step: 1, title: 'Add PDF Files', description: 'Upload two or more PDF documents you wish to combine.' },
      { step: 2, title: 'Order & Arrange', description: 'Drag and drop the files to set your preferred page sequence.' },
      { step: 3, title: 'Merge & Download', description: 'Download the combined master PDF with all links and bookmarks intact.' },
    ],
    features: [
      'Client-side engine: merge unlimited files locally in your browser memory',
      'Interactive visual thumbnail reordering',
      'Preserves original quality, vector paths, and embedded color spaces',
      'Zero file size limits for standard everyday document consolidation',
    ],
    faqs: [
      {
        question: 'Is there a limit on how many PDFs I can merge?',
        answer: 'You can combine dozens of PDF documents simultaneously. Processing takes just seconds thanks to our client-accelerated engine.',
      },
      {
        question: 'Will original formatting or vector quality be modified?',
        answer: 'No. Merge PDF performs container-level page concatenation, preserving exact vector paths, fonts, and raster images without recompression.',
      },
    ],
    relatedToolSlugs: ['split-pdf', 'compress-pdf', 'pdf-to-word', 'pdf-editor'],
    longContent: {
      overview: 'Keep your digital paperwork organized by assembling scattered contracts, scanned appendices, reports, and receipts into one seamless master PDF file. No watermarks, no software downloads, and no waiting.',
      useCases: [
        { audience: 'Attorneys & Paralegals', description: 'Collate legal briefs, exhibits, declarations, and court filings into compliant singular volumes.' },
        { audience: 'Mortgage & Loan Processors', description: 'Unify bank statements, W2s, paystubs, and disclosure forms into one clean package.' },
        { audience: 'Academic Researchers', description: 'Stitch multi-part journal submissions and supplementary materials together.' },
      ],
      securityNotice: 'Processing occurs securely in local client memory when using standard files.',
    },
  },

  // 6. Split PDF
  {
    id: 'tool-split-pdf',
    slug: 'split-pdf',
    name: 'Split PDF',
    category: 'management',
    shortDescription: 'Separate one PDF into individual pages or extract custom page ranges.',
    h1: 'Split PDF Online - Extract Pages from PDF',
    seoTitle: 'Split PDF - Extract Pages & Split PDF Pages Online | PDFNova',
    seoDescription: 'Split PDF online for free. Separate PDF pages or extract custom page ranges from your document with instant browser download. 100% private.',
    keywords: ['split PDF', 'extract pages from PDF', 'split PDF pages', 'separate PDF pages'],
    icon: 'Split',
    isActive: true,
    maxFileSizeMb: 100,
    allowedMimeTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    clientExecutable: true,
    options: [
      {
        id: 'splitMode',
        label: 'Splitting Method',
        type: 'select',
        defaultValue: 'range',
        options: [
          { label: 'Custom Range (e.g., 1-5, 8, 11-14)', value: 'range' },
          { label: 'Split Every Page into Individual PDFs', value: 'all' },
        ],
      },
      {
        id: 'pageRange',
        label: 'Page Ranges to Extract',
        type: 'text',
        defaultValue: '1-3',
        helpText: 'Specify page numbers or intervals separated by commas (e.g., 1-4, 7, 9-12).',
      },
    ],
    howItWorks: [
      { step: 1, title: 'Upload Large PDF', description: 'Upload the document you want to split or extract pages from.' },
      { step: 2, title: 'Specify Range', description: 'Type the pages you need or choose to split every page separately.' },
      { step: 3, title: 'Download Result', description: 'Save the extracted PDF pages immediately.' },
    ],
    features: [
      'Flexible range syntax: easily extract non-consecutive pages (e.g., 1-2, 5, 10-15)',
      'Burst mode: split 100-page documents into individual 1-page files',
      'Client-side instant generation with zero server upload delay',
      'Maintains pristine page bookmarks and internal link fidelity',
    ],
    faqs: [
      {
        question: 'How do I extract only specific pages?',
        answer: 'Select "Custom Range" and enter the page numbers. For example, typing "1-3, 7" will create a 4-page PDF containing pages 1, 2, 3, and 7.',
      },
    ],
    relatedToolSlugs: ['merge-pdf', 'compress-pdf', 'pdf-to-word', 'delete-pdf-pages'],
    longContent: {
      overview: 'Extract only the necessary sections of a massive PDF file. Perfect for isolating contracts, saving single chapters from textbooks, or removing extraneous pages before sharing sensitive documents.',
      useCases: [
        { audience: 'Real Estate Agents', description: 'Extract just the signing pages from voluminous 50-page closing disclosures.' },
        { audience: 'Students', description: 'Pull relevant textbook chapters to study on mobile without downloading 500MB textbooks.' },
      ],
      securityNotice: 'Client-accelerated processing keeps sensitive pages strictly on your own device.',
    },
  },

  // 7. Compress PDF
  {
    id: 'tool-compress-pdf',
    slug: 'compress-pdf',
    name: 'Compress PDF',
    category: 'management',
    shortDescription: 'Reduce PDF file size significantly while maintaining crisp readability and quality.',
    h1: 'Compress PDF Online - Reduce PDF File Size',
    seoTitle: 'Compress PDF Online - Reduce PDF File Size & Make PDF Smaller | PDFNova',
    seoDescription: 'Compress PDF online to reduce PDF file size and make PDF smaller without losing quality. Ideal for email attachments and portal uploads. Fast and free.',
    keywords: ['compress PDF', 'reduce PDF file size', 'compress PDF online', 'make PDF smaller'],
    icon: 'Minimize2',
    isActive: true,
    maxFileSizeMb: 100,
    allowedMimeTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    options: [
      {
        id: 'compressionLevel',
        label: 'Compression Preset',
        type: 'select',
        defaultValue: 'recommended',
        options: [
          { label: 'Recommended (Great Quality, ~65% Size Reduction)', value: 'recommended' },
          { label: 'Extreme Compression (Smallest File Size, Good Quality)', value: 'extreme' },
          { label: 'Low Compression (High Quality, ~30% Size Reduction)', value: 'low' },
        ],
      },
    ],
    howItWorks: [
      { step: 1, title: 'Upload Your PDF', description: 'Select the file that exceeds your email or portal upload limits.' },
      { step: 2, title: 'Intelligent Optimization', description: 'Unused objects are purged, fonts deduplicated, and raster streams re-encoded.' },
      { step: 3, title: 'Download Shrunken PDF', description: 'Download your lightweight PDF and see the exact megabyte savings.' },
    ],
    features: [
      'Stream optimization: strips redundant metadata and XML bloat',
      'Advanced JPEG2000 and Flate stream re-quantization',
      'Instant before/after file size savings indicator',
      'Keeps vector charts, bookmarks, and text completely crisp',
    ],
    faqs: [
      {
        question: 'Will text become blurry after compression?',
        answer: 'No! Vector text and fonts are preserved at 100% mathematical fidelity. Compression optimizes embedded images and eliminates redundant PDF metadata.',
      },
      {
        question: 'What is the average file size reduction?',
        answer: 'Most documents containing scans or high-res images reduce by 50% to 80% without noticeable degradation on screens.',
      },
    ],
    relatedToolSlugs: ['merge-pdf', 'pdf-to-word', 'image-compressor', 'split-pdf'],
    longContent: {
      overview: 'Email servers commonly reject attachments over 25MB, and government or university portals often impose strict 2MB or 5MB limits. PDFNova re-compresses embedded raster streams, strips redundant font subsets, and removes unreferenced document objects so your files pass every upload validation.',
      useCases: [
        { audience: 'Job Applicants', description: 'Shrink portfolio and resume PDFs so they pass applicant tracking system (ATS) size limits.' },
        { audience: 'Business Executives', description: 'Send multi-page pitch decks and company profiles effortlessly via regular email without cloud links.' },
      ],
      securityNotice: 'All optimization routines execute securely in temporary memory containers.',
    },
  },

  // 8. PDF to Text
  {
    id: 'tool-pdf-to-text',
    slug: 'pdf-to-text',
    name: 'PDF to Text',
    category: 'content',
    shortDescription: 'Extract raw text, paragraphs, and tables from any PDF into clean TXT or Markdown.',
    h1: 'PDF to Text Converter - Extract Text from PDF Online',
    seoTitle: 'PDF to Text - Extract Text from PDF & Convert PDF to Text | PDFNova',
    seoDescription: 'Extract text from PDF online for free. Convert PDF to text cleanly while preserving paragraphs, headings, and character encodings.',
    keywords: ['PDF to text', 'extract text from PDF', 'convert PDF to text', 'PDF text extractor'],
    icon: 'AlignLeft',
    isActive: true,
    maxFileSizeMb: 50,
    allowedMimeTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    howItWorks: [
      { step: 1, title: 'Upload PDF', description: 'Select any PDF document with selectable text.' },
      { step: 2, title: 'Text Stream Parsing', description: 'Our parser extracts raw character streams while preserving paragraph breaks.' },
      { step: 3, title: 'Copy or Download', description: 'Copy text to clipboard with one click or download as a .txt file.' },
    ],
    features: [
      'Preserves logical reading order across multi-column magazine layouts',
      'One-click "Copy All Text" button for instant pasting into Notion, Docs, or IDEs',
      'Extracts embedded metadata (author, creation date, keywords)',
      'Export to TXT, Markdown, or JSON structured tokens',
    ],
    faqs: [
      {
        question: 'What happens if my PDF is a scanned image with no selectable text?',
        answer: 'For scanned documents or photos of pages, use our dedicated PDF OCR tool, which uses computer vision to recognize letters and numbers.',
      },
    ],
    relatedToolSlugs: ['ocr-pdf', 'pdf-summarizer', 'pdf-to-word', 'chat-with-pdf'],
    longContent: {
      overview: 'Extract raw textual content from academic papers, legal transcripts, e-books, and financial reports. Ideal for researchers, developers training LLMs, and writers needing unformatted text for drafting.',
      useCases: [
        { audience: 'Developers & Data Scientists', description: 'Extract clean corpus text from document archives for natural language processing and search indexing.' },
        { audience: 'Journalists & Writers', description: 'Quickly grab quotes and statements from government press releases and court documents.' },
      ],
      securityNotice: 'Parsed text is rendered directly in your session and purged immediately upon browser reset.',
    },
  },

  // 9. PDF OCR
  {
    id: 'tool-ocr-pdf',
    slug: 'ocr-pdf',
    name: 'OCR PDF',
    category: 'content',
    shortDescription: 'Optical Character Recognition to convert scanned PDFs and photos into searchable text.',
    h1: 'OCR PDF - Make Scanned PDF Searchable Online',
    seoTitle: 'OCR PDF - Make Searchable PDF & Extract Text from Scanned PDF | PDFNova',
    seoDescription: 'Free online OCR PDF tool. Convert scanned PDFs and images into searchable PDF documents and selectable text with high-accuracy character recognition.',
    keywords: ['OCR PDF', 'searchable PDF', 'extract text from scanned PDF', 'OCR scanned PDF'],
    icon: 'Eye',
    isAi: true,
    isActive: true,
    maxFileSizeMb: 50,
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
    options: [
      {
        id: 'ocrLanguage',
        label: 'Document Language',
        type: 'select',
        defaultValue: 'en',
        options: [
          { label: 'English', value: 'en' },
          { label: 'Spanish (Español)', value: 'es' },
          { label: 'French (Français)', value: 'fr' },
          { label: 'German (Deutsch)', value: 'de' },
          { label: 'Chinese (Simplified)', value: 'zh' },
          { label: 'Japanese', value: 'ja' },
          { label: 'Arabic', value: 'ar' },
        ],
      },
    ],
    howItWorks: [
      { step: 1, title: 'Upload Scanned Document', description: 'Upload a scanned PDF or smartphone photo of a document.' },
      { step: 2, title: 'Computer Vision OCR', description: 'Our neural vision pipeline identifies glyphs, words, and bounding boxes.' },
      { step: 3, title: 'Download Searchable Output', description: 'Download as a searchable PDF with invisible text layer or copy text directly.' },
    ],
    features: [
      'High-accuracy recognition even on skewed, crumpled, or low-contrast paper scans',
      'Multi-language OCR engine covering over 50 global languages',
      'Dual output: download pure text or a Searchable PDF with original visual overlay',
      'Preserves tabular layout of invoices, receipts, and spreadsheets',
    ],
    faqs: [
      {
        question: 'What is a "Searchable PDF"?',
        answer: 'A Searchable PDF preserves the exact original scanned image on top while embedding an invisible, accurately aligned layer of text underneath, allowing you to highlight, search (Ctrl+F), and copy text.',
      },
      {
        question: 'Can it read handwriting?',
        answer: 'Printed text yields near 99% accuracy. Clear, block handwriting is recognized with high fidelity, though cursive script may vary.',
      },
    ],
    relatedToolSlugs: ['pdf-to-text', 'pdf-to-word', 'pdf-summarizer', 'pdf-translator'],
    longContent: {
      overview: 'Turn dead image scans into dynamic digital assets. Optical Character Recognition (OCR) bridges the physical and digital worlds, making historical records, paper receipts, and archived documents fully searchable and indexable.',
      useCases: [
        { audience: 'Accounting & Accounts Payable', description: 'Extract line items, totals, and dates from paper vendor invoices automatically.' },
        { audience: 'Libraries & Archivists', description: 'Digitize physical collections and historical manuscripts for full-text search discovery.' },
      ],
      securityNotice: 'OCR processing utilizes secure stateless vision APIs with immediate stream purging.',
    },
  },

  // 10. PDF Summarizer
  {
    id: 'tool-pdf-summarizer',
    slug: 'pdf-summarizer',
    name: 'PDF Summarizer',
    category: 'content',
    shortDescription: 'Generate executive summaries, key bullet points, and actionable takeaways with AI.',
    h1: 'Summarize PDF Online - AI PDF Summarizer Tool',
    seoTitle: 'Summarize PDF Online - AI PDF Summarizer & Document Summary Tool | PDFNova',
    seoDescription: 'Summarize PDF online in seconds with AI. Free AI PDF summarizer tool to extract key bullet points, executive briefs, and core findings from long documents.',
    keywords: ['summarize PDF', 'AI PDF summarizer', 'summarize PDF online', 'PDF summary tool'],
    icon: 'Sparkles',
    isAi: true,
    isActive: true,
    maxFileSizeMb: 50,
    allowedMimeTypes: ['application/pdf', 'text/plain'],
    allowedExtensions: ['.pdf', '.txt'],
    options: [
      {
        id: 'summaryMode',
        label: 'Summary Format',
        type: 'select',
        defaultValue: 'executive',
        options: [
          { label: 'Executive Overview (Short & Punchy)', value: 'executive' },
          { label: 'Detailed Breakdown (Section by Section)', value: 'detailed' },
          { label: 'Key Points & Action Items', value: 'keypoints' },
          { label: 'Important Questions & FAQ', value: 'questions' },
        ],
      },
    ],
    howItWorks: [
      { step: 1, title: 'Upload Long PDF', description: 'Upload research studies, legal contracts, or business reports.' },
      { step: 2, title: 'AI Semantic Analysis', description: 'Our AI model analyzes themes, methodologies, data findings, and core conclusions.' },
      { step: 3, title: 'Review Insights', description: 'Explore summaries, copy key quotes, and export your brief in one click.' },
    ],
    features: [
      'Multiple summary formats: Executive brief, in-depth analysis, bullet points, and key questions',
      'Supports technical papers, scientific notation, and financial tables',
      'Export summary directly to Markdown, PDF, or clipboard',
      'Powered by state-of-the-art document foundation models',
    ],
    faqs: [
      {
        question: 'How long can the uploaded document be?',
        answer: 'You can upload documents up to 50MB and hundreds of pages. The AI summarizes the overarching narrative and extracts key granular findings.',
      },
      {
        question: 'Does the AI hallucinate or make up facts?',
        answer: 'Our document engine is strictly grounded in the uploaded document text, citing specific sections and avoiding speculative fabrications.',
      },
    ],
    relatedToolSlugs: ['chat-with-pdf', 'pdf-translator', 'pdf-to-text', 'ocr-pdf'],
    longContent: {
      overview: 'Reading through 80-page financial audits, regulatory disclosures, or 30-page academic journals consumes hours of valuable time. PDFNova AI PDF Summarizer condenses dense prose into clear, actionable bullet points, highlighting core methodology, statistics, risks, and conclusions in seconds.',
      useCases: [
        { audience: 'Students & Researchers', description: 'Grasp the core thesis, methodology, and experimental results of journal articles in 60 seconds.' },
        { audience: 'Investors & Analysts', description: 'Digest 10-K filings, earnings reports, and prospectus releases before quarterly conference calls.' },
        { audience: 'Managers & Executives', description: 'Quickly evaluate policy proposals, vendor agreements, and audit findings.' },
      ],
      securityNotice: 'Your proprietary documents are never stored or used to train general AI models.',
    },
  },

  // 11. Chat with PDF
  {
    id: 'tool-chat-with-pdf',
    slug: 'chat-with-pdf',
    name: 'Chat with PDF',
    category: 'content',
    shortDescription: 'Have an interactive conversation with your document and ask questions with citations.',
    h1: 'Chat with PDF Online - Ask Questions About PDF with AI',
    seoTitle: 'Chat with PDF Online - AI Chat with PDF & Talk to PDF | PDFNova',
    seoDescription: 'Chat with PDF online for free. Ask questions about PDF documents, talk to PDF with AI, and get instant answers with page-level citations and verified quotes.',
    keywords: ['chat with PDF', 'ask questions about PDF', 'AI chat with PDF', 'talk to PDF'],
    icon: 'MessageSquare',
    isAi: true,
    isActive: true,
    maxFileSizeMb: 50,
    allowedMimeTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    howItWorks: [
      { step: 1, title: 'Upload Document', description: 'Upload manuals, legal contracts, textbooks, or research papers.' },
      { step: 2, title: 'Ask Questions', description: 'Type natural questions like "What are the termination conditions in Section 4?".' },
      { step: 3, title: 'Get Instant Answers', description: 'Receive direct answers complete with page citations and referenced text.' },
    ],
    features: [
      'Interactive side-by-side split screen: document viewer alongside chat thread',
      'Direct page citations for every claim and answer provided',
      'Pre-populated starter prompts tailored to the document topic',
      'Download complete chat dialogue history as notes',
    ],
    faqs: [
      {
        question: 'Can I chat with complex legal or technical documents?',
        answer: 'Yes! The AI assistant excels at navigating technical terminology, dense contractual clauses, financial tables, and scientific papers.',
      },
      {
        question: 'Can I ask follow-up questions?',
        answer: 'Yes, full conversation context is maintained throughout your session so you can explore nuances, request simpler analogies, or demand specific data points.',
      },
    ],
    relatedToolSlugs: ['pdf-summarizer', 'pdf-translator', 'ocr-pdf', 'pdf-to-text'],
    longContent: {
      overview: 'Instead of skimming endless pages looking for an elusive detail, Chat with PDF enables a natural dialogue with any document. Ask complex analytical questions, cross-reference sections, verify numbers, and locate buried definitions instantly.',
      useCases: [
        { audience: 'Legal Counsel', description: 'Instantly uncover indemnity limits, jurisdiction clauses, and renewal terms across 100-page master service agreements.' },
        { audience: 'Medical & Healthcare', description: 'Cross-examine clinical trials, dosage guidelines, and patient case studies.' },
        { audience: 'Engineers & Developers', description: 'Navigate 400-page hardware datasheets and API specs without hunting through table of contents.' },
      ],
      securityNotice: 'Session context is stored only in ephemeral memory and discarded once you end your session.',
    },
  },

  // 12. PDF Translator
  {
    id: 'tool-pdf-translator',
    slug: 'pdf-translator',
    name: 'PDF Translator',
    category: 'content',
    shortDescription: 'Translate entire PDF documents into 50+ languages while preserving layout and structure.',
    h1: 'Translate PDF Online - Free PDF Document Translator',
    seoTitle: 'PDF Translator - Translate PDF Online into 50+ Languages | PDFNova',
    seoDescription: 'Translate PDF online into 50+ languages while preserving original formatting, tables, and layouts. Free, fast, and accurate PDF translation online.',
    keywords: ['translate PDF', 'online PDF translation', 'translate PDF document', 'PDF translator online'],
    icon: 'Globe',
    isAi: true,
    isActive: true,
    maxFileSizeMb: 50,
    allowedMimeTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    options: [
      {
        id: 'targetLanguage',
        label: 'Translate To',
        type: 'select',
        defaultValue: 'es',
        options: [
          { label: 'Spanish (Español)', value: 'es' },
          { label: 'French (Français)', value: 'fr' },
          { label: 'German (Deutsch)', value: 'de' },
          { label: 'Italian (Italiano)', value: 'it' },
          { label: 'Portuguese (Português)', value: 'pt' },
          { label: 'Chinese (Simplified)', value: 'zh' },
          { label: 'Japanese (日本語)', value: 'ja' },
          { label: 'Arabic (العربية)', value: 'ar' },
          { label: 'English', value: 'en' },
        ],
      },
    ],
    howItWorks: [
      { step: 1, title: 'Upload PDF', description: 'Upload a foreign language PDF document.' },
      { step: 2, title: 'Choose Target Language', description: 'Pick from over 50 supported international languages.' },
      { step: 3, title: 'Download Translated PDF', description: 'Get a clean, translated document with formatting and tables preserved.' },
    ],
    features: [
      'Neural translation models specialized in technical, legal, and academic vernacular',
      'Dual-pane reader: view original source text alongside translated text',
      'Preserves original tables, graphs, images, and visual layout geometry',
      'Support for right-to-left (RTL) scripts including Arabic and Hebrew',
    ],
    faqs: [
      {
        question: 'Will tables and image placement be maintained?',
        answer: 'Yes! Our layout reconstruction engine translates the text while maintaining document coordinates, keeping tables, figures, and charts aligned.',
      },
    ],
    relatedToolSlugs: ['ai-pdf-summarizer', 'chat-with-pdf', 'ocr-pdf', 'pdf-to-word'],
    longContent: {
      overview: 'Overcome global language barriers with precision. PDFNova PDF Translator preserves document formatting while translating contracts, product manuals, academic studies, and travel paperwork into your native language.',
      useCases: [
        { audience: 'Global Business & Trade', description: 'Translate foreign supplier contracts, customs declarations, and compliance manuals.' },
        { audience: 'International Students', description: 'Read foreign language academic journals and university admission requirements with ease.' },
      ],
      securityNotice: 'Translation jobs are executed over encrypted TLS pipelines without permanent document storage.',
    },
  },

  // 13. PDF Editor
  {
    id: 'tool-pdf-editor',
    slug: 'pdf-editor',
    name: 'PDF Editor',
    category: 'management',
    shortDescription: 'Add text, shapes, annotations, highlight lines, and sign PDF documents online.',
    h1: 'Edit PDF Online Free',
    seoTitle: 'Free Online PDF Editor - Add Text, Sign & Annotate PDF | PDFNova',
    seoDescription: 'Edit PDF files directly in your web browser. Add text, annotations, signature drawings, callouts, and blackout sensitive areas with zero installation.',
    keywords: ['pdf editor', 'edit pdf online', 'free pdf editor', 'sign pdf online'],
    icon: 'PenTool',
    isActive: true,
    maxFileSizeMb: 50,
    allowedMimeTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    howItWorks: [
      { step: 1, title: 'Upload Document', description: 'Select the PDF file you need to sign or edit.' },
      { step: 2, title: 'Annotate & Add Text', description: 'Type new text, draw your e-signature, or redact confidential numbers.' },
      { step: 3, title: 'Save & Download', description: 'Export your edited PDF immediately with vector crispness.' },
    ],
    features: [
      'Digital signature tool with smooth stylus, mouse, or typed sign options',
      'Freehand markup pencil, rectangle highlighter, and redaction blocks',
      'Add custom text blocks with adjustable font size, color, and weight',
      '100% browser-based canvas editor with instant undo/redo',
    ],
    faqs: [
      {
        question: 'Can I sign contracts using this editor?',
        answer: 'Yes! You can draw your signature, upload a signature image, or type your name to generate a clean electronic signature.',
      },
    ],
    relatedToolSlugs: ['merge-pdf', 'compress-pdf', 'split-pdf', 'pdf-to-word'],
    longContent: {
      overview: 'Fill out PDF forms, add signatures, annotate drafts, and redact private information without paying for expensive desktop software licenses. All tools run directly in modern web browsers.',
      useCases: [
        { audience: 'Freelancers & Contractors', description: 'Sign client NDAs and work statements quickly without printing or scanning.' },
        { audience: 'Remote Workers', description: 'Review colleagues drafts, leave sticky note markups, and highlight key revisions.' },
      ],
      securityNotice: 'Edits occur within your local browser canvas for privacy.',
    },
  },

  // 14. Image Compressor
  {
    id: 'tool-image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    category: 'image',
    shortDescription: 'Compress JPG, PNG, and WebP images up to 80% without noticeable quality loss.',
    h1: 'Image Compressor - Compress JPG PNG WebP Online',
    seoTitle: 'Image Compressor - Compress JPG, PNG, WebP & Reduce Image Size | PDFNova',
    seoDescription: 'Free online image compressor to compress JPG, PNG, and WebP files. Reduce image size online by up to 80% without losing visual clarity. 100% private in-browser.',
    keywords: ['image compressor', 'compress JPG PNG WebP', 'reduce image size', 'compress images online'],
    icon: 'Sliders',
    isActive: true,
    maxFileSizeMb: 25,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    multiFile: true,
    clientExecutable: true,
    options: [
      {
        id: 'quality',
        label: 'Compression Quality',
        type: 'range',
        defaultValue: 80,
        min: 20,
        max: 95,
        step: 5,
        helpText: '80% is the optimal balance between high visual clarity and small file size.',
      },
    ],
    howItWorks: [
      { step: 1, title: 'Upload Images', description: 'Drag and drop one or multiple JPG, PNG, or WebP files.' },
      { step: 2, title: 'Adjust Quality', description: 'Slide the quality control to dial in your target file size.' },
      { step: 3, title: 'Download Compressed Files', description: 'Download your optimized images individually or as a ZIP package.' },
    ],
    features: [
      'Client-side browser compression with zero latency',
      'Batch optimize up to 20 images at once',
      'Shows live before/after size comparisons and percentage saved',
      'WebP conversion support for modern web performance',
    ],
    faqs: [
      {
        question: 'Does this compressor support transparent PNGs?',
        answer: 'Yes! PNG transparency is fully maintained throughout the compression cycle.',
      },
    ],
    relatedToolSlugs: ['image-resizer', 'jpg-to-pdf', 'compress-pdf', 'pdf-to-jpg'],
    longContent: {
      overview: 'Speed up website loading times, shrink attachments, and save disk space with our intelligent image optimizer. Reduce image payload while preserving vibrant colors and sharp edges.',
      useCases: [
        { audience: 'Web Designers & Bloggers', description: 'Optimize hero banners and article photos to achieve higher Google PageSpeed scores.' },
        { audience: 'E-commerce Sellers', description: 'Batch compress product photos for Shopify, Amazon, or Etsy listings.' },
      ],
      securityNotice: 'Client-side processing keeps your photos private on your computer.',
    },
  },

  // 15. Image Resizer
  {
    id: 'tool-image-resizer',
    slug: 'image-resizer',
    name: 'Image Resizer',
    category: 'image',
    shortDescription: 'Resize photos to exact pixel dimensions or percentage scale with aspect ratio lock.',
    h1: 'Image Resizer - Resize JPG PNG WebP Online',
    seoTitle: 'Image Resizer - Resize Images Online & Change Dimensions | PDFNova',
    seoDescription: 'Resize images online for free. Change image dimensions, pixel resolutions, and scale JPG, PNG, and WebP with aspect ratio lock and high-clarity resampling.',
    keywords: ['image resizer', 'resize images online', 'change image dimensions', 'resize JPG PNG WebP'],
    icon: 'Maximize',
    isActive: true,
    maxFileSizeMb: 25,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    clientExecutable: true,
    options: [
      {
        id: 'scalePercent',
        label: 'Resize Scale (%)',
        type: 'select',
        defaultValue: '50',
        options: [
          { label: '75% of original size', value: '75' },
          { label: '50% of original size', value: '50' },
          { label: '25% of original size', value: '25' },
        ],
      },
    ],
    howItWorks: [
      { step: 1, title: 'Upload Image', description: 'Select the image file you want to scale down or resize.' },
      { step: 2, title: 'Select Scale', description: 'Choose your desired scale percentage or target resolution.' },
      { step: 3, title: 'Download Resized Image', description: 'Save your newly proportioned image instantly.' },
    ],
    features: [
      'High-quality bicubic interpolation prevents pixelation and artifacts',
      'Batch resize capability for photography collections',
      'Aspect ratio preservation lock prevents distortion',
    ],
    faqs: [
      {
        question: 'Will resizing distort my photo aspect ratio?',
        answer: 'No, aspect ratios are locked by default so your image retains its natural proportions.',
      },
    ],
    relatedToolSlugs: ['image-compressor', 'jpg-to-pdf', 'pdf-to-jpg'],
    longContent: {
      overview: 'Easily adjust image resolutions to meet passport photo requirements, social media cover dimensions, and email thumbnail constraints without needing desktop photo software.',
      useCases: [
        { audience: 'Social Media Managers', description: 'Format images for Instagram, LinkedIn, YouTube thumbnails, and Twitter headers.' },
      ],
      securityNotice: 'Images are processed inside your browser canvas.',
    },
  },

  // 16. PNG to PDF
  {
    id: 'tool-png-to-pdf',
    slug: 'png-to-pdf',
    name: 'PNG to PDF',
    category: 'conversion',
    shortDescription: 'Convert transparent and high-resolution PNG images into clean, standardized PDF files.',
    h1: 'PNG to PDF - Convert PNG Images to PDF Online',
    seoTitle: 'PNG to PDF Converter - Convert PNG Images to PDF Online | PDFNova',
    seoDescription: 'Convert PNG to PDF online for free. Combine transparent PNG images to PDF documents with custom margins, orientation, and high image fidelity.',
    keywords: ['PNG to PDF', 'convert PNG images to PDF', 'PNG image to PDF', 'PNG to PDF online'],
    icon: 'Image',
    isActive: true,
    maxFileSizeMb: 60,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    allowedExtensions: ['.png', '.jpg', '.jpeg', '.webp'],
    multiFile: true,
    clientExecutable: true,
    options: [
      {
        id: 'orientation',
        label: 'Page Orientation',
        type: 'select',
        defaultValue: 'portrait',
        options: [
          { label: 'Auto (Fit Image Dimensions)', value: 'auto' },
          { label: 'Portrait', value: 'portrait' },
          { label: 'Landscape', value: 'landscape' },
        ],
      },
    ],
    howItWorks: [
      { step: 1, title: 'Upload PNG Image(s)', description: 'Select one or more PNG image files with or without transparency.' },
      { step: 2, title: 'Arrange Order', description: 'Reorder image sequence or configure output page layout.' },
      { step: 3, title: 'Download PDF', description: 'Download your compiled PDF document with zero transparency distortion.' },
    ],
    features: [
      'Full PNG alpha-channel transparency preservation',
      'Combine multiple PNG snapshots into one unified multi-page PDF',
      'Lossless pixel fidelity suitable for infographics and vector screenshots',
      'Client-side execution ensuring your graphic assets stay strictly private',
    ],
    faqs: [
      {
        question: 'Will PNG transparency turn black when converted to PDF?',
        answer: 'No. Our renderer embeds PNG alpha channels correctly so transparent areas render clean white or transparent backgrounds.',
      },
      {
        question: 'Can I combine multiple PNG files into one PDF?',
        answer: 'Yes, upload as many PNG images as you need and combine them into a single consolidated PDF document.',
      },
    ],
    relatedToolSlugs: ['jpg-to-pdf', 'pdf-to-jpg', 'image-compressor', 'merge-pdf'],
    longContent: {
      overview: 'PNG images are widely used for digital illustrations, product logos, and UI screenshots because of their lossless clarity and alpha-channel transparency. Converting PNG to PDF packages your graphics into a portable, universally viewable format ideal for client presentations and print archiving.',
      useCases: [
        { audience: 'UI/UX & Product Designers', description: 'Collate app design screens and mockups into client review portfolios.' },
        { audience: 'Engineers & Architects', description: 'Package transparent schematic diagrams and CAD exports into unified submittals.' },
      ],
      securityNotice: 'PNG processing executes within local browser memory with zero permanent cloud retention.',
    },
  },

  // 17. PDF to Excel
  {
    id: 'tool-pdf-to-excel',
    slug: 'pdf-to-excel',
    name: 'PDF to Excel',
    category: 'conversion',
    shortDescription: 'Extract tables, numerical columns, and structured financial data from PDF to editable Excel.',
    h1: 'PDF to Excel Converter - Convert PDF to Excel Online',
    seoTitle: 'PDF to Excel Converter - Extract PDF Tables to Excel Online | PDFNova',
    seoDescription: 'Convert PDF to Excel online for free. Extract PDF tables to Excel (XLSX, CSV) with accurate rows, columns, numbers, and data formatting preserved.',
    keywords: ['PDF to Excel converter', 'extract PDF tables to Excel', 'PDF to XLSX', 'convert PDF to Excel'],
    icon: 'FileText',
    isActive: true,
    maxFileSizeMb: 50,
    allowedMimeTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    howItWorks: [
      { step: 1, title: 'Upload PDF Document', description: 'Select the statement, invoice, or report containing data tables.' },
      { step: 2, title: 'Table Detection & Parsing', description: 'Our engine identifies grid lines, delimiters, column headers, and numerical cells.' },
      { step: 3, title: 'Download Excel File', description: 'Open your extracted spreadsheet immediately in Microsoft Excel or Google Sheets.' },
    ],
    features: [
      'Automatic column and row boundary recognition across complex multi-page tables',
      'Accurate numerical formatting and currency symbol parsing',
      'Eliminates manual copy-pasting and re-typing errors',
      'Output compatible with Excel (.xlsx), CSV, and Google Sheets',
    ],
    faqs: [
      {
        question: 'Can it convert multi-page PDF statements into a continuous spreadsheet?',
        answer: 'Yes! Rows spanning across consecutive pages are seamlessly joined into contiguous spreadsheet tables.',
      },
      {
        question: 'Are formulas preserved?',
        answer: 'PDF files do not contain native mathematical formulas. Our tool extracts exact numerical values and mathematical relationships accurately.',
      },
    ],
    relatedToolSlugs: ['pdf-to-word', 'pdf-to-text', 'ocr-pdf', 'compress-pdf'],
    longContent: {
      overview: 'Manually copying figures and tabular rows from PDF financial statements, bank records, and invoices is tedious and error-prone. PDFNova PDF to Excel converter scans geometric cell alignments to produce clean, formulas-ready spreadsheets.',
      useCases: [
        { audience: 'Accountants & Bookkeepers', description: 'Convert quarterly vendor bills, receipts, and bank statements directly into spreadsheets.' },
        { audience: 'Data Analysts & Researchers', description: 'Extract statistical tables and survey data from government reports into clean analysis sheets.' },
      ],
      securityNotice: 'Financial documents are processed through isolated, ephemeral memory containers without persistent storage.',
    },
  },

  // 18. PDF to PowerPoint
  {
    id: 'tool-pdf-to-powerpoint',
    slug: 'pdf-to-powerpoint',
    name: 'PDF to PowerPoint',
    category: 'conversion',
    shortDescription: 'Convert PDF document pages and slides into editable Microsoft PowerPoint (.pptx) presentations.',
    h1: 'PDF to PowerPoint Converter - Convert PDF to PowerPoint Online',
    seoTitle: 'PDF to PowerPoint Converter - Convert PDF to PPT Online | PDFNova',
    seoDescription: 'Convert PDF to PowerPoint online for free. Transform PDF pages and slides into editable PPTX presentations with layout and graphics intact.',
    keywords: ['PDF to PowerPoint converter', 'PDF to PPT', 'PDF to PPTX', 'convert PDF to PowerPoint'],
    icon: 'FileText',
    isActive: true,
    maxFileSizeMb: 50,
    allowedMimeTypes: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    howItWorks: [
      { step: 1, title: 'Upload PDF Slides', description: 'Select the PDF pitch deck, lecture slides, or presentation document.' },
      { step: 2, title: 'Slide Master Synthesis', description: 'Each PDF page is converted into a distinct, editable slide with vector shapes.' },
      { step: 3, title: 'Download PPTX', description: 'Save your editable presentation ready for PowerPoint, Keynote, or Google Slides.' },
    ],
    features: [
      'Preserves slide master proportions, margins, typography, and color schemes',
      'Transforms vector diagrams and raster images into movable presentation objects',
      '100% compatible with Microsoft PowerPoint (.pptx), Keynote, and Google Slides',
      'Fast batch processing for decks with 50+ slides',
    ],
    faqs: [
      {
        question: 'Will text in the PowerPoint slides be editable?',
        answer: 'Yes! Selectable text blocks from your PDF are transformed into editable native PowerPoint text boxes.',
      },
      {
        question: 'Can I open the resulting file in Google Slides?',
        answer: 'Absolutely. The output is a standardized .pptx archive fully supported by Google Slides, PowerPoint, and Apple Keynote.',
      },
    ],
    relatedToolSlugs: ['pdf-to-word', 'word-to-pdf', 'pdf-to-jpg', 'compress-pdf'],
    longContent: {
      overview: 'Pitch decks and keynote presentations are frequently shared as locked PDF files, making it impossible to tweak talking points or revise outdated figures. PDFNova PDF to PowerPoint converter reconstructs slide layouts into native PPTX presentations so you can edit slides effortlessly.',
      useCases: [
        { audience: 'Sales & Marketing Teams', description: 'Update pitch decks, company overviews, and client proposals without starting from scratch.' },
        { audience: 'Educators & Professors', description: 'Adapt slide presentations and lecture materials for subsequent academic terms.' },
      ],
      securityNotice: 'Presentation decks are handled with strict encryption and purged immediately upon job completion.',
    },
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  const clean = slug.replace(/^\//, '');
  if (clean === 'ai-pdf-summarizer') {
    return TOOLS_DATA.find((t) => t.slug === 'pdf-summarizer');
  }
  return TOOLS_DATA.find((t) => t.slug === clean);
}

export function getRelatedTools(tool: Tool): Tool[] {
  return tool.relatedToolSlugs
    .map((s) => TOOLS_DATA.find((t) => t.slug === s || (s === 'ai-pdf-summarizer' && t.slug === 'pdf-summarizer')))
    .filter((t): t is Tool => Boolean(t));
}
